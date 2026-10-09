import { cookies } from 'next/headers';
import { adminEnabled,validSession,cookieName } from '@/lib/auth';
import { getSql } from '@/lib/db';
import { continuity } from '@/lib/continuity';
import { newsroomSettings } from '@/lib/newsroom';
import { PageHeading } from '@/components/editorial';
import { AdminDesk,AdminLogin } from '@/components/admin-desk';
import type { CanonEvent,Draft,Entity,Storyline } from '@/lib/contracts';
export const metadata={title:'Protected editorial desk',robots:{index:false,follow:false}};
export default async function Admin() {
 const heading=<PageHeading kicker="PROTECTED DEVELOPMENT WORKSPACE" title="The editorial desk." description="Canon first. Reporting second. Publication by an accountable editor."/>;
 if(!adminEnabled())return <>{heading}<div className="empty-state"><h3>The editorial desk is locked.</h3><p>This local-only workspace is disabled by default and unavailable in production builds.</p><p>For local editing, run <code>npm run admin:setup</code>, then start the development server and sign in with your unique token.</p></div></>;
 const session=(await cookies()).get(cookieName)?.value;if(!validSession(session))return <>{heading}<AdminLogin/></>;
 const sql=getSql();
 const events=(sql.prepare("SELECT document,status FROM events WHERE status!='published'").all() as {document:string;status:string}[]).map(r=>{const event=JSON.parse(r.document) as CanonEvent;return {event,status:r.status,issues:continuity(sql,event)};});
 const drafts=(sql.prepare("SELECT document,status,scheduled_at FROM articles WHERE status IN ('draft','approved','scheduled')").all() as {document:string;status:string;scheduled_at:string|null}[]).map(r=>({draft:JSON.parse(r.document) as Draft,status:r.status,scheduledAt:r.scheduled_at}));
 const docs=<T,>(table:'entities'|'storylines')=>(sql.prepare(`SELECT document FROM ${table}`).all() as {document:string}[]).map(r=>JSON.parse(r.document) as T);
 return <>{heading}<AdminDesk events={events} drafts={drafts} entities={docs<Entity>('entities')} storylines={docs<Storyline>('storylines')} settings={newsroomSettings(sql)} jobs={sql.prepare('SELECT id,status,estimated_cents,error FROM jobs ORDER BY created_at DESC LIMIT 30').all() as {id:string;status:string;estimated_cents:number;error:string|null}[]} audits={sql.prepare('SELECT id,action,target,created_at FROM audits ORDER BY id DESC LIMIT 40').all() as {id:number;action:string;target:string;created_at:string}[]} reports={sql.prepare('SELECT id,comment_id,reason,status FROM reports ORDER BY created_at DESC LIMIT 50').all() as {id:string;comment_id:string;reason:string;status:string}[]}/></>;
}
