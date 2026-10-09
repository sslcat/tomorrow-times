import { and, desc, eq } from 'drizzle-orm';
import { getDb, getSql, type Sqlite } from './db';
import { articlesTable } from './schema';
import { ageOn } from './calendar';
import type { Article, CanonEvent, Draft, Entity, Storyline } from './contracts';
type ArticleRow={id:string;title:string;document:string;status:string;published_real:string|null;published_fiction:string|null;scheduled_at:string|null};
export function articleFromRow(row:ArticleRow):Article {return {...JSON.parse(row.document) as Draft,title:row.title,status:row.status,publishedReal:row.published_real,publishedFiction:row.published_fiction,scheduledAt:row.scheduled_at};}
export function allArticles(section?:string): Article[] {
 return getDb().select().from(articlesTable).where(and(eq(articlesTable.status,'published'),section?eq(articlesTable.section,section):undefined)).orderBy(desc(articlesTable.publishedFiction)).all().map(row=>({...row.document,title:row.title,status:row.status,publishedReal:row.publishedReal,publishedFiction:row.publishedFiction,scheduledAt:row.scheduledAt}));
}
export function getArticle(id:string,sql=getSql()):Article|undefined {
 const row=sql.prepare("SELECT * FROM articles WHERE id=? AND status IN ('published','retracted')").get(id) as ArticleRow|undefined;
 return row?articleFromRow(row):undefined;
}
export type PublicEntity=Omit<Entity,'privateFacts'|'motivation'|'flaw'|'arc'|'state'> & { circumstance?: string; age?:number };
export function publicEntity(e:Entity):PublicEntity {
 // An explicit allowlist prevents editorial-only facts, future arcs and state leaking into public pages or search.
 return {id:e.id,kind:e.kind,name:e.name,summary:e.summary,biography:e.biography,home:e.home,birthDate:e.birthDate,occupation:e.occupation,reputation:e.reputation,visual:e.visual,circumstance:typeof e.state.circumstance==='string'?e.state.circumstance:undefined,age:e.birthDate?ageOn(e.birthDate,'3026-10-09'):undefined};
}
export const allEntities=(sql=getSql())=>(sql.prepare('SELECT document FROM entities ORDER BY name').all() as {document:string}[]).map(row=>publicEntity(JSON.parse(row.document)));
export const getEntity=(id:string)=>allEntities().find(e=>e.id===id);
export const allStorylines=(sql=getSql())=>(sql.prepare('SELECT document FROM storylines ORDER BY id').all() as {document:string}[]).map(row=>{const s=JSON.parse(row.document) as Storyline;return {id:s.id,title:s.title,summary:s.summary,status:s.status,participants:s.participants,facts:s.facts,questions:s.questions};});
export const getStoryline=(id:string)=>allStorylines().find(s=>s.id===id);
export const publishedEvents=(sql=getSql())=>(sql.prepare("SELECT document FROM events WHERE status='published' ORDER BY date,id").all() as {document:string}[]).map(row=>{const e=JSON.parse(row.document) as CanonEvent;return {id:e.id,title:e.title,date:e.date,storylineId:e.storylineId,facts:e.facts,allegations:e.allegations,participants:e.participants,locationId:e.locationId};});
export function relatedArticles(key:string,kind:'entity'|'storyline',sql=getSql()):Article[] {
 const rows=(kind==='entity'?sql.prepare("SELECT a.* FROM articles a JOIN article_entities ae ON a.id=ae.article_id WHERE ae.entity_id=? AND a.status='published' ORDER BY a.published_fiction DESC"):sql.prepare("SELECT * FROM articles WHERE storyline_id=? AND status='published' ORDER BY published_fiction DESC")).all(key) as ArticleRow[];
 return rows.map(articleFromRow);
}
export type SearchResult={id:string;title:string;summary:string;kind:string;href:string};
export function search(query:string,sql=getSql()):SearchResult[] {
 const q=query.trim().toLocaleLowerCase().slice(0,120); if(!q)return [];
 const matches=(s:string)=>s.toLocaleLowerCase().includes(q);
 const articles=(sql.prepare("SELECT * FROM articles WHERE status='published'").all() as ArticleRow[]).map(articleFromRow);
 return [
  ...articles.filter(a=>matches(`${a.title} ${a.dek} ${a.body.join(' ')}`)).map(a=>({id:a.id,title:a.title,summary:a.dek,kind:'Article',href:`/articles/${a.id}`})),
  ...allEntities(sql).filter(e=>matches(`${e.name} ${e.summary} ${e.biography}`)).map(e=>({id:e.id,title:e.name,summary:e.summary,kind:e.kind,href:`/entities/${e.id}`})),
  ...allStorylines(sql).filter(s=>matches(`${s.title} ${s.summary}`)).map(s=>({id:s.id,title:s.title,summary:s.summary,kind:'Storyline',href:`/storylines/${s.id}`})),
  ...publishedEvents(sql).filter(e=>matches(`${e.title} ${e.facts.join(' ')}`)).map(e=>({id:e.id,title:e.title,summary:e.facts[0],kind:'Event',href:`/events/${e.id}`})),
 ].slice(0,100);
}
export const leagueTeams = [{id:'comets',name:'Ceres Comets'},{id:'saints',name:'Tranquility Saints'},{id:'ribbons',name:'Red Ribbons'},{id:'juniper',name:'Juniper Orchard'},{id:'lantern',name:'Lantern Keepers'},{id:'morrow',name:'Morrow Swifts'}];
export type Fixture={id:string;event_id:string;home:string;away:string;home_score:number;away_score:number};
export function standings(sql:Sqlite=getSql()) {
 const fixtures=sql.prepare('SELECT * FROM fixtures').all() as Fixture[];
 const table=leagueTeams.map(t=>{
  const games=fixtures.filter(f=>f.home===t.id||f.away===t.id);
  const scores=games.map(f=>f.home===t.id?[f.home_score,f.away_score]:[f.away_score,f.home_score]);
  return {...t,played:games.length,won:scores.filter(([a,b])=>a>b).length,drawn:scores.filter(([a,b])=>a===b).length,points:scores.reduce((n,[a,b])=>n+(a>b?3:a===b?1:0),0),difference:scores.reduce((n,[a,b])=>n+a-b,0)};
 });return table.sort((a,b)=>b.points-a.points||b.difference-a.difference||a.name.localeCompare(b.name));
}
export function correctionHistory(id:string) {return (getSql().prepare("SELECT action,created_at,after_json FROM audits WHERE target=? AND action IN ('correction','retraction') ORDER BY id").all(id) as {action:string;created_at:string;after_json:string}[]).map(r=>({action:r.action,at:r.created_at,...JSON.parse(r.after_json) as {note:string}}));}
