import { z } from 'zod';
import { audit, officialThread, type Sqlite } from './db';
import { fictionalDate } from './calendar';
import { draftSchema, eventSchema, type CanonEvent, type Draft, type Entity, type Storyline } from './contracts';
import { continuity } from './continuity';
import { bounded, provider } from './providers';
export const settingsSchema=z.object({paused:z.boolean(),dailyLimit:z.number().int().min(1).max(10),frequency:z.enum(['manual','daily-draft','twice-weekly-draft']),scheduledEnabled:z.literal(false)});
export const newsroomSettings=(sql:Sqlite)=>settingsSchema.parse(JSON.parse((sql.prepare("SELECT value FROM settings WHERE id='newsroom'").get() as {value:string}).value));
function loadEvent(sql:Sqlite,id:string) {const r=sql.prepare('SELECT document,status FROM events WHERE id=?').get(id) as {document:string;status:string}|undefined;if(!r)throw new Error('Event not found');return {event:eventSchema.parse(JSON.parse(r.document)),status:r.status};}
function checkEvent(sql:Sqlite,e:CanonEvent,reviewed:boolean) {const issues=continuity(sql,e);if(issues.some(i=>i.severity==='error')||issues.length&&!reviewed)throw new Error(issues.map(i=>i.message).join('; '));}
export function checkDraft(sql:Sqlite,draft:unknown):Draft {
 const d=draftSchema.parse(draft);
 for(const id of d.entityIds)if(!sql.prepare('SELECT 1 FROM entities WHERE id=?').get(id))throw new Error(`Unknown article entity ${id}`);
 if(!sql.prepare("SELECT 1 FROM entities WHERE id=? AND kind='person'").get(d.authorId))throw new Error('Unknown author');
 for(const id of d.eventIds) {const {event,status}=loadEvent(sql,id);if(!['approved','published'].includes(status))throw new Error('Draft events require approval');if(event.storylineId!==d.storylineId)throw new Error('Draft storyline conflicts with event');}
 for(const claim of d.claims) {if(!d.eventIds.includes(claim.eventId))throw new Error('Unlinked claim');const {event}=loadEvent(sql,claim.eventId);if(!event.facts.includes(claim.fact))throw new Error('Claim is not an established canonical fact');}
 if(new Set(d.body).size!==d.body.length)throw new Error('Repeated paragraphs');
 if(sql.prepare('SELECT 1 FROM articles WHERE lower(title)=lower(?) AND id<>?').get(d.title,d.id))throw new Error('Repeated headline');
 return d;
}
export async function generateProposal(sql:Sqlite,key:string,actor:string,now=new Date()) {
 z.string().min(8).max(100).regex(/^[a-zA-Z0-9-]+$/).parse(key);
 const settings=newsroomSettings(sql);
 if(settings.paused)throw new Error('Generation is paused');
 const existing=sql.prepare('SELECT status,result FROM jobs WHERE id=?').get(key) as {status:string;result:string|null}|undefined;
 if(existing)return existing;
 const stamp=now.toISOString();
 sql.transaction(()=>{
  const count=(sql.prepare('SELECT COUNT(*) n FROM jobs WHERE created_at>=?').get(`${stamp.slice(0,10)}T00:00:00.000Z`) as {n:number}).n;
  if(count>=settings.dailyLimit)throw new Error('Daily generation limit reached');
  sql.prepare("INSERT INTO jobs(id,status,created_at) VALUES (?,'running',?)").run(key,stamp);
 })();
 try {
  const p=provider();if(p.paid||p.estimateCents()>0)throw new Error('Paid providers require owner approval');
  const docs=<T>(table:'entities'|'storylines'|'events'):T[]=>(sql.prepare(`SELECT document FROM ${table}${table==='events'?" WHERE status='published'":''}`).all() as {document:string}[]).map(r=>JSON.parse(r.document) as T);
  const e=eventSchema.parse(await bounded(()=>p.propose({date:fictionalDate(now),entities:docs<Entity>('entities'),storylines:docs<Storyline>('storylines'),events:docs<CanonEvent>('events')})));
  checkEvent(sql,e,true);
  sql.transaction(()=>{
   sql.prepare("INSERT INTO events(id,fingerprint,date,storyline_id,status,document) VALUES (?,?,?,?,'proposed',?)").run(e.id,e.fingerprint,e.date,e.storylineId,JSON.stringify(e));
   sql.prepare("UPDATE jobs SET status='completed',result=? WHERE id=?").run(e.id,key);
   audit(sql,'proposal',e.id,actor,{provider:p.name,event:e,costCents:0});
  })();return {status:'completed',result:e.id};
 }catch(error){sql.prepare("UPDATE jobs SET status='failed',error=? WHERE id=?").run(error instanceof Error?error.message.slice(0,300):'Provider failed',key);throw error;}
}
export function approveEvent(sql:Sqlite,id:string,actor:string,reviewed=false) {
 sql.transaction(()=>{const {event,status}=loadEvent(sql,id);if(status==='approved'||status==='published')return;if(status!=='proposed')throw new Error('Only a proposed event can be approved');checkEvent(sql,event,reviewed);sql.prepare("UPDATE events SET status='approved',approved_at=? WHERE id=?").run(new Date().toISOString(),id);audit(sql,'event-approval',id,actor,{reviewed,event});})();
}
export async function draftEvent(sql:Sqlite,id:string,actor:string) {
 const {event,status}=loadEvent(sql,id);if(!['approved','published'].includes(status))throw new Error('Approve the event first');
 const existing=sql.prepare('SELECT article_id FROM article_events WHERE event_id=?').get(id) as {article_id:string}|undefined;if(existing)return existing.article_id;
 const d=checkDraft(sql,await bounded(()=>provider().draft(event)));
 sql.transaction(()=>{sql.prepare("INSERT INTO articles(id,title,section,storyline_id,status,document) VALUES (?,?,?,?,'draft',?)").run(d.id,d.title,d.section,d.storylineId,JSON.stringify(d));d.eventIds.forEach(e=>sql.prepare('INSERT INTO article_events VALUES (?,?)').run(d.id,e));d.entityIds.forEach(e=>sql.prepare('INSERT INTO article_entities VALUES (?,?)').run(d.id,e));audit(sql,'draft',d.id,actor,{assignment:{section:d.section,format:d.format,events:d.eventIds},draft:d});})();return d.id;
}
export function editDraft(sql:Sqlite,id:string,title:string,body:string[],actor:string) {
 sql.transaction(()=>{const row=sql.prepare('SELECT document,status FROM articles WHERE id=?').get(id) as {document:string;status:string}|undefined;if(!row||!['draft','approved','scheduled'].includes(row.status))throw new Error('Only unpublished drafts can be edited here');const old=JSON.parse(row.document) as Draft;const d=checkDraft(sql,{...old,title,body});sql.prepare("UPDATE articles SET title=?,document=?,status='draft',scheduled_at=NULL,revision=revision+1 WHERE id=?").run(d.title,JSON.stringify(d),id);audit(sql,'draft-edit',id,actor,d,old);})();
}
export function approveDraft(sql:Sqlite,id:string,actor:string) {sql.transaction(()=>{const row=sql.prepare('SELECT document,status FROM articles WHERE id=?').get(id) as {document:string;status:string}|undefined;if(!row)throw new Error('Draft not found');if(row.status==='approved')return;if(row.status!=='draft')throw new Error('Only drafts may be approved');checkDraft(sql,JSON.parse(row.document));sql.prepare("UPDATE articles SET status='approved' WHERE id=?").run(id);audit(sql,'draft-approval',id,actor,{humanClaimReview:true});})();}
export function scheduleArticle(sql:Sqlite,id:string,at:string,actor:string,now=new Date()) {const parsed=z.iso.datetime().parse(at);if(Date.parse(parsed)<=now.valueOf())throw new Error('Schedule must be in the future');sql.transaction(()=>{const result=sql.prepare("UPDATE articles SET status='scheduled',scheduled_at=? WHERE id=? AND status='approved'").run(parsed,id);if(!result.changes)throw new Error('Approve the draft before scheduling');audit(sql,'schedule',id,actor,{at:parsed,automatic:false});})();}
function applyEffects(sql:Sqlite,e:CanonEvent,actor:string) {
 const get=(id:string)=>JSON.parse((sql.prepare('SELECT document FROM entities WHERE id=?').get(id) as {document:string}).document) as Entity;
 const save=(entity:Entity,before:Entity)=>{sql.prepare('UPDATE entities SET document=?,revision=revision+1 WHERE id=?').run(JSON.stringify(entity),entity.id);audit(sql,'canon-mutation',entity.id,actor,entity,before);};
 for(const effect of e.effects) {
  if(effect.type==='fixture'){sql.prepare('INSERT INTO fixtures VALUES (?,?,?,?,?,?)').run(effect.fixtureId,e.id,effect.home,effect.away,effect.homeScore,effect.awayScore);continue;}
  const entity=get(effect.entityId),before=structuredClone(entity);
  if(effect.type==='state')entity.state[effect.key]=effect.value;
  if(effect.type==='travel'){entity.state.location=effect.to;entity.state.lastArrival=effect.arrival;}
  if(effect.type==='death')entity.state.deathDate=effect.date;
  if(effect.type==='office'){entity.state.office=effect.office;entity.state.jurisdiction=effect.jurisdiction;}
  if(effect.type==='ownership')entity.state.owner=effect.ownerId;
  if(effect.type==='relationship') {const other=get(effect.otherId),old=structuredClone(other);if(effect.relationship==='married'){entity.state.spouse=other.id;other.state.spouse=entity.id;}else if(effect.relationship==='divorced'){entity.state.spouse=null;other.state.spouse=null;}else {entity.state[`${effect.relationship}:${other.id}`]=true;other.state[`${effect.relationship}:${entity.id}`]=true;}save(other,old);}
  save(entity,before);
 }
}
export function publish(sql:Sqlite,id:string,actor:string,now=new Date()) {
 return sql.transaction(()=>{
  const row=sql.prepare('SELECT document,status,scheduled_at FROM articles WHERE id=?').get(id) as {document:string;status:string;scheduled_at:string|null}|undefined;
  if(!row)throw new Error('Article not found');if(row.status==='published')return {id,alreadyPublished:true};
  if(!['approved','scheduled'].includes(row.status))throw new Error('Publication requires explicit draft approval');
  if(row.scheduled_at&&Date.parse(row.scheduled_at)>now.valueOf())throw new Error('Scheduled time has not arrived');
  const d=checkDraft(sql,JSON.parse(row.document));const today=fictionalDate(now);
  for(const eventId of d.eventIds) {
   const {event,status}=loadEvent(sql,eventId);if(status==='published')continue;
   if(status!=='approved')throw new Error('Event approval missing');if(event.date>today)throw new Error('Cannot publish a future event');checkEvent(sql,event,true);
   applyEffects(sql,event,actor);
   sql.prepare("UPDATE events SET status='published',published_at=? WHERE id=?").run(now.toISOString(),eventId);
   const story=JSON.parse((sql.prepare('SELECT document FROM storylines WHERE id=?').get(event.storylineId) as {document:string}).document) as Storyline;
   const old=structuredClone(story);story.facts=[...new Set([...story.facts,...event.facts])];
   sql.prepare('UPDATE storylines SET document=?,revision=revision+1 WHERE id=?').run(JSON.stringify(story),story.id);audit(sql,'storyline-update',story.id,actor,story,old);
   audit(sql,'event-publication',event.id,actor,event);
  }
  sql.prepare("UPDATE articles SET status='published',published_real=?,published_fiction=?,scheduled_at=NULL WHERE id=?").run(now.toISOString(),today,id);
  officialThread(sql,id,now.toISOString());audit(sql,'publication',id,actor,{real:now.toISOString(),fiction:today});
  return {id,alreadyPublished:false};
 })();
}
export function reject(sql:Sqlite,kind:'event'|'article',id:string,actor:string,note:string) {
 z.string().min(5).max(1000).parse(note);
 sql.transaction(()=>{const table=kind==='event'?'events':'articles';const r=sql.prepare(`UPDATE ${table} SET status='rejected' WHERE id=? AND status IN ('proposed','approved','draft','scheduled')`).run(id);if(!r.changes)throw new Error('Cannot reject this record');audit(sql,'rejection',id,actor,{note,kind});})();
}
export function correctArticle(sql:Sqlite,id:string,note:string,title:string,body:string[],actor:string,retract=false) {
 z.string().min(10).max(1000).parse(note);
 sql.transaction(()=>{const row=sql.prepare("SELECT document FROM articles WHERE id=? AND status='published'").get(id) as {document:string}|undefined;if(!row)throw new Error('Published article required');const old=JSON.parse(row.document) as Draft;const updated=checkDraft(sql,{...old,title,body});sql.prepare('UPDATE articles SET title=?,document=?,status=?,revision=revision+1 WHERE id=?').run(title,JSON.stringify(updated),retract?'retracted':'published',id);sql.prepare('UPDATE threads SET title=?,hidden=? WHERE article_id=? AND official=1').run(title,retract?1:0,id);audit(sql,retract?'retraction':'correction',id,actor,{note,document:updated},old);})();
}
