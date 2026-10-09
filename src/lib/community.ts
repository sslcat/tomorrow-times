import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { audit, type Sqlite } from './db';
export type Reader={id:string;name:string;role:'reader'|'moderator';verified:number;suspended:number};
export function rateLimit(sql:Sqlite,key:string,limit=8,windowMs=60000,now=Date.now()) {
 return sql.transaction(()=>{const row=sql.prepare('SELECT started_at,hits FROM rate_limits WHERE key=?').get(key) as {started_at:number;hits:number}|undefined;
  if(!row||now-row.started_at>=windowMs){sql.prepare('INSERT INTO rate_limits VALUES (?,?,1) ON CONFLICT(key) DO UPDATE SET started_at=excluded.started_at,hits=1').run(key,now);return;}
  if(row.hits>=limit)throw new Error('Rate limit reached. Try again later.');
  sql.prepare('UPDATE rate_limits SET hits=hits+1 WHERE key=?').run(key);
 })();
}
export function requireReader(sql:Sqlite,verifiedSessionUserId:string|null,moderator=false):Reader {
 if(!verifiedSessionUserId)throw new Error('Verified authentication required');
 const user=sql.prepare('SELECT * FROM users WHERE id=?').get(verifiedSessionUserId) as Reader|undefined;
 if(!user?.verified||user.suspended)throw new Error('Verified active reader required');
 if(moderator&&user.role!=='moderator')throw new Error('Moderator permission required');return user;
}
export function visibleThread(sql:Sqlite,id:string) {
 return sql.prepare("SELECT t.*,a.title article_title FROM threads t JOIN articles a ON a.id=t.article_id WHERE t.id=? AND t.hidden=0 AND a.status='published'").get(id) as {id:string;article_id:string;title:string;section:string;official:number;created_at:string;article_title:string}|undefined;
}
export function listThreads(sql:Sqlite,sort='recent',page=1,section?:string) {
 const order=sort==='popular'?'comment_count DESC,t.updated_at DESC':sort==='newest'?'t.created_at DESC':'t.updated_at DESC';
 const p=Math.max(1,Math.min(10000,Math.floor(page)||1));
 return sql.prepare(`SELECT t.*, (SELECT COUNT(*) FROM comments c WHERE c.thread_id=t.id AND c.hidden=0) comment_count FROM threads t JOIN articles a ON a.id=t.article_id WHERE t.hidden=0 AND a.status='published' ${section?'AND t.section=?':''} ORDER BY ${order},t.id LIMIT 12 OFFSET ?`).all(...(section?[section,(p-1)*12]:[(p-1)*12])) as {id:string;article_id:string;title:string;section:string;official:number;created_at:string;comment_count:number}[];
}
export function createTopic(sql:Sqlite,sessionUserId:string|null,articleId:string,title:string) {
 const user=requireReader(sql,sessionUserId);z.string().trim().min(8).max(160).parse(title);rateLimit(sql,`topic:${user.id}`,3);
 const article=sql.prepare("SELECT section FROM articles WHERE id=? AND status='published'").get(articleId) as {section:string}|undefined;if(!article)throw new Error('A published source article is required');
 const id=randomUUID(),now=new Date().toISOString();sql.prepare('INSERT INTO threads(id,article_id,author_id,title,section,official,created_at,updated_at) VALUES (?,?,?,?,?,0,?,?)').run(id,articleId,user.id,title,article.section,now,now);return id;
}
export function postComment(sql:Sqlite,sessionUserId:string|null,threadId:string,body:string,parentId:string|null=null,spoiler=false) {
 const user=requireReader(sql,sessionUserId);const clean=z.string().trim().min(2).max(4000).parse(body);rateLimit(sql,`comment:${user.id}`);
 if(!visibleThread(sql,threadId))throw new Error('Published discussion required');
 if(parentId&&!sql.prepare('SELECT 1 FROM comments WHERE id=? AND thread_id=? AND hidden=0').get(parentId,threadId))throw new Error('Reply must belong to this thread');
 const id=randomUUID(),now=new Date().toISOString();
 sql.transaction(()=>{sql.prepare('INSERT INTO comments(id,thread_id,author_id,parent_id,body,spoiler,created_at) VALUES (?,?,?,?,?,?,?)').run(id,threadId,user.id,parentId,clean,spoiler?1:0,now);sql.prepare('UPDATE threads SET updated_at=? WHERE id=?').run(now,threadId);})();return id;
}
export function reportComment(sql:Sqlite,sessionUserId:string|null,commentId:string,reason:string) {
 const user=requireReader(sql,sessionUserId);z.string().trim().min(8).max(1000).parse(reason);rateLimit(sql,`report:${user.id}`,5);
 const c=sql.prepare('SELECT thread_id FROM comments WHERE id=? AND hidden=0').get(commentId) as {thread_id:string}|undefined;if(!c||!visibleThread(sql,c.thread_id))throw new Error('Visible published comment required');
 const id=randomUUID();sql.transaction(()=>{const r=sql.prepare('INSERT OR IGNORE INTO reports(id,reporter_id,comment_id,reason,created_at) VALUES (?,?,?,?,?)').run(id,user.id,commentId,reason,new Date().toISOString());if(r.changes)audit(sql,'report',commentId,user.id,{reportId:id,reason});})();return id;
}
export function moderate(sql:Sqlite,sessionUserId:string|null,target:string,action:'hide'|'restore'|'suspend'|'unsuspend'|'resolve',reason:string) {
 const user=requireReader(sql,sessionUserId,true);z.string().min(8).max(1000).parse(reason);
 sql.transaction(()=>{
  let changes=0;
  if(action==='hide'||action==='restore')changes=sql.prepare('UPDATE comments SET hidden=? WHERE id=?').run(action==='hide'?1:0,target).changes;
  else if(action==='suspend'||action==='unsuspend')changes=sql.prepare('UPDATE users SET suspended=? WHERE id=?').run(action==='suspend'?1:0,target).changes;
  else changes=sql.prepare("UPDATE reports SET status='resolved' WHERE id=?").run(target).changes;
  if(!changes)throw new Error('Moderation target not found');audit(sql,`moderation-${action}`,target,user.id,{reason});
 })();
}
export function toggleReaction(sql:Sqlite,sessionUserId:string|null,commentId:string) {
 const user=requireReader(sql,sessionUserId);rateLimit(sql,`reaction:${user.id}`,20);
 const c=sql.prepare('SELECT thread_id FROM comments WHERE id=? AND hidden=0').get(commentId) as {thread_id:string}|undefined;if(!c||!visibleThread(sql,c.thread_id))throw new Error('Visible published comment required');
 sql.transaction(()=>{if(sql.prepare('DELETE FROM reactions WHERE user_id=? AND comment_id=?').run(user.id,commentId).changes===0)sql.prepare('INSERT INTO reactions VALUES (?,?)').run(user.id,commentId);})();
}
export function toggleThreadFollow(sql:Sqlite,sessionUserId:string|null,threadId:string) {
 const user=requireReader(sql,sessionUserId);if(!visibleThread(sql,threadId))throw new Error('Visible published thread required');
 sql.transaction(()=>{if(sql.prepare('DELETE FROM thread_follows WHERE user_id=? AND thread_id=?').run(user.id,threadId).changes===0)sql.prepare('INSERT INTO thread_follows VALUES (?,?)').run(user.id,threadId);})();
}
