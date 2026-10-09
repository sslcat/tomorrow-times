import { ageOn, daysBetween, validDate } from './calendar';
import { eventSchema, type CanonEvent, type Entity, type Storyline } from './contracts';
import { travelMinimum } from '../data/world';
import type { Sqlite } from './db';
export type Issue={code:string;message:string;severity:'error'|'review'};
export function continuity(sql:Sqlite,input:unknown):Issue[] {
 const parsed=eventSchema.safeParse(input);
 if(!parsed.success)return [{code:'schema',message:parsed.error.issues.map(i=>i.message).join('; '),severity:'error'}];
 const e=parsed.data, issues:Issue[]=[];
 const fail=(code:string,message:string,severity:Issue['severity']='error')=>issues.push({code,message,severity});
 const rows=sql.prepare('SELECT document FROM entities').all() as {document:string}[];
 const entities=new Map(rows.map(r=>{const v=JSON.parse(r.document) as Entity;return [v.id,v];}));
 const existing=sql.prepare("SELECT document FROM events WHERE status IN ('approved','published') AND id<>?").all(e.id) as {document:string}[];
 const events=existing.map(r=>JSON.parse(r.document) as CanonEvent);
 const storyRow=sql.prepare('SELECT document FROM storylines WHERE id=?').get(e.storylineId) as {document:string}|undefined;
 if(!storyRow)fail('storyline','Unknown storyline');
 else {const s=JSON.parse(storyRow.document) as Storyline;if(s.status==='Resolved')fail('storyline','A resolved storyline needs an explicit editorial reopening','review');}
 if(e.rules.ftl)fail('ftl','Faster-than-light travel and communication violate world canon');
 const location=entities.get(e.locationId);
 if(location?.kind!=='location')fail('location','Event location must be an inhabited canonical location');
 if(location?.state.jurisdiction!==e.jurisdiction)fail('jurisdiction','Jurisdiction does not match the event location');
 if(events.some(x=>x.fingerprint===e.fingerprint || x.date===e.date&&x.title.toLowerCase()===e.title.toLowerCase()))fail('duplicate','This event already exists');
 for(const id of e.participants) {
  const person=entities.get(id); if(!person){fail('entity',`Unknown participant: ${id}`);continue;}
  if(person.birthDate) {const age=ageOn(person.birthDate,e.date);if(age<0||age>171)fail('age',`Impossible age for ${person.name}`);}
  if(typeof person.state.deathDate==='string'&&person.state.deathDate<=e.date)fail('death',`${person.name} died before this event; use historical attribution, not participation`);
 }
 for(const id of e.causes) {const cause=events.find(v=>v.id===id);if(!cause)fail('cause',`Cause ${id} must already be approved or published`);else if(cause.date>e.date)fail('chronology','A cause cannot occur after its consequence');}
 const minMinutes=(id:string)=>['titan'].includes(id)?65:['europa','ganymede'].includes(id)?35:['ceres','waystation'].includes(id)?12:['ares','valles','venus'].includes(id)?4:0.03;
 if(e.rules.communicationMinutes!==undefined) {
  const from=e.rules.communicationFrom;
  if(!from||entities.get(from)?.kind!=='location')fail('communication','A communication must name its canonical origin');
  else if(from!==e.locationId&&e.rules.communicationMinutes<Math.max(minMinutes(from),minMinutes(e.locationId)))fail('latency','Communication is faster than the corridor’s conservative light-delay bound');
 }
 // Evaluate effects against a shadow state so conflicts inside one proposal are caught too.
 const fixtures=new Map((sql.prepare('SELECT id,home,away,home_score,away_score FROM fixtures').all() as {id:string;home:string;away:string;home_score:number;away_score:number}[]).map(f=>[f.id,f]));
 for(const f of e.effects) {
  if(f.type==='fixture') {
   if(f.home===f.away)fail('fixture','A team cannot play itself');
   if(!['comets','saints','ribbons','juniper','lantern','morrow'].includes(f.home)||!['comets','saints','ribbons','juniper','lantern','morrow'].includes(f.away))fail('fixture','Unknown league team');
   if(fixtures.has(f.fixtureId))fail('fixture','A fixture result already exists; use a separately audited correction');
   fixtures.set(f.fixtureId,{id:f.fixtureId,home:f.home,away:f.away,home_score:f.homeScore,away_score:f.awayScore});continue;
  }
  const entity=entities.get(f.entityId);
  if(!entity){fail('entity',`Unknown affected entity ${f.entityId}`);continue;}
  if(f.type==='death') {
   if(entity.kind!=='person'||entity.state.deathDate)fail('death','Only a living person can acquire a death record');
   if(f.date!==e.date || entity.birthDate&&f.date<entity.birthDate)fail('chronology','Death must match the event date and follow birth');
   entity.state.deathDate=f.date;
  }
  if(f.type==='travel') {
   if(entity.kind!=='person')fail('travel','Travel requires a person');
   if(!entities.has(f.from)||!entities.has(f.to))fail('entity','Unknown travel endpoint');
   if(entity.state.location!==f.from)fail('travel','Departure does not match the last canonical location');
   if(f.arrival!==e.date||f.departure>f.arrival)fail('chronology','Arrival must match the event date and follow departure');
   if(typeof entity.state.lastArrival==='string'&&f.departure<entity.state.lastArrival)fail('travel','Travel overlaps the previous journey');
   const minimum=travelMinimum(f.from,f.to);
   if(minimum===null)fail('travel','No approved route exists; an editor must first extend the versioned route canon');
   else if(daysBetween(f.departure,f.arrival)<minimum)fail('travel','Travel is faster than the approved corridor minimum');
   entity.state.location=f.to;entity.state.lastArrival=f.arrival;
  }
  if(f.type==='office') {
   if(entity.kind!=='person'||entities.get(f.jurisdiction)?.kind!=='location')fail('office','Office requires a person and a known jurisdiction');
   if(f.jurisdiction!==e.jurisdiction)fail('jurisdiction','A local appointment must occur in its governing jurisdiction');
   if([...entities.values()].some(p=>p.id!==entity.id&&p.state.office===f.office&&!p.state.deathDate))fail('office','A living incumbent already holds this office; an audited transition is required');
   entity.state.office=f.office;entity.state.jurisdiction=f.jurisdiction;
  }
  if(f.type==='relationship') {
   const other=entities.get(f.otherId);
   if(entity.kind!=='person'||other?.kind!=='person'||other.id===entity.id){fail('relationship','Relationships require two distinct people');continue;}
   if(f.relationship==='married') {
    if(entity.state.spouse||other.state.spouse)fail('relationship','Existing marriage must be resolved first');
    if(entity.birthDate&&ageOn(entity.birthDate,e.date)<18||other.birthDate&&ageOn(other.birthDate,e.date)<18)fail('relationship','Marriage requires adult participants');
    entity.state.spouse=other.id;other.state.spouse=entity.id;
   }
   if(f.relationship==='divorced') {if(entity.state.spouse!==other.id||other.state.spouse!==entity.id)fail('relationship','No reciprocal marriage exists');entity.state.spouse=null;other.state.spouse=null;}
  }
  if(f.type==='ownership') {
   if(entity.kind!=='organization'||!entities.has(f.ownerId)||f.ownerId===entity.id)fail('ownership','Ownership requires an organization and a distinct canonical owner');
   let owner=entities.get(f.ownerId);const seen=new Set([entity.id]);
   while(owner){if(seen.has(owner.id)){fail('ownership','Corporate ownership cycle');break;}seen.add(owner.id);owner=typeof owner.state.owner==='string'?entities.get(owner.state.owner):undefined;}
   entity.state.owner=f.ownerId;
  }
 }
 if(e.allegations.length)fail('allegation','Allegations require attribution review and must not be promoted to established facts','review');
 if(!validDate(e.date))fail('date','Invalid event date');
 return issues;
}
