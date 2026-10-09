import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { adminEnabled,allowedOrigin,cookieName,createSession,sameSecret,validSession } from '@/lib/auth';
import { getSql,audit } from '@/lib/db';
import { rateLimit,moderate } from '@/lib/community';
import { generateProposal,approveEvent,draftEvent,editDraft,approveDraft,publish,reject,scheduleArticle,settingsSchema,correctArticle } from '@/lib/newsroom';
const requestSchema=z.object({action:z.enum(['login','logout','generate','approve-event','draft','edit','approve-draft','publish','reject-event','reject-article','schedule','settings','correct','retract','moderate']),id:z.string().max(100).optional(),token:z.string().max(200).optional(),title:z.string().max(180).optional(),body:z.array(z.string().max(4000)).max(25).optional(),note:z.string().max(1000).optional(),at:z.string().max(50).optional(),reviewed:z.boolean().optional(),settings:settingsSchema.optional(),moderationAction:z.enum(['hide','restore','suspend','unsuspend','resolve']).optional()});
export async function POST(request:Request) {
 if(!adminEnabled())return NextResponse.json({error:'Development editorial desk is disabled'},{status:403});
 if(!allowedOrigin(request))return NextResponse.json({error:'Origin rejected'},{status:403});
 try {
  if(Number(request.headers.get('content-length'))>40000)return NextResponse.json({error:'Request too large'},{status:413});
  const reader=request.body?.getReader();if(!reader)throw new Error('Missing body');let size=0;const chunks:Uint8Array[]=[];
  while(true){const {value,done}=await reader.read();if(done)break;size+=value.byteLength;if(size>40000){await reader.cancel();return NextResponse.json({error:'Request too large'},{status:413});}chunks.push(value);}
  const input=requestSchema.parse(JSON.parse(Buffer.concat(chunks).toString('utf8')));
  const jar=await cookies();
  if(input.action==='login') {
   rateLimit(getSql(),'admin-login',10,15*60000);
   if(!sameSecret(input.token||'',process.env.ADMIN_TOKEN!))return NextResponse.json({error:'Invalid editor token'},{status:401});
   jar.set(cookieName,createSession(),{httpOnly:true,sameSite:'strict',secure:(process.env.ADMIN_ORIGIN||'').startsWith('https:'),path:'/',maxAge:8*3600});return NextResponse.json({ok:true});
  }
  if(!validSession(jar.get(cookieName)?.value))return NextResponse.json({error:'Editor authentication required'},{status:401});
  if(input.action==='logout'){jar.delete(cookieName);return NextResponse.json({ok:true});}
  const sql=getSql(),actor='local-editor';rateLimit(sql,'admin-mutations',60);
  const id=input.id||'';
  switch(input.action) {
   case 'generate': await generateProposal(sql,id,actor);break;
   case 'approve-event': approveEvent(sql,id,actor,input.reviewed);break;
   case 'draft': await draftEvent(sql,id,actor);break;
   case 'edit': editDraft(sql,id,input.title||'',input.body||[],actor);break;
   case 'approve-draft': if(!input.reviewed)throw new Error('Confirm manual claim and prose review');approveDraft(sql,id,actor);break;
   case 'publish': publish(sql,id,actor);break;
   case 'reject-event':case 'reject-article': reject(sql,input.action==='reject-event'?'event':'article',id,actor,input.note||'');break;
   case 'schedule': scheduleArticle(sql,id,input.at||'',actor);break;
   case 'settings': {const settings=settingsSchema.parse(input.settings);sql.transaction(()=>{sql.prepare("UPDATE settings SET value=? WHERE id='newsroom'").run(JSON.stringify(settings));audit(sql,'settings','newsroom',actor,settings);})();break;}
   case 'correct':case 'retract':correctArticle(sql,id,input.note||'',input.title||'',input.body||[],actor,input.action==='retract');break;
   case 'moderate': {
    sql.prepare("INSERT OR IGNORE INTO users(id,name,role,verified) VALUES ('local-moderator','Local editor','moderator',1)").run();
    moderate(sql,'local-moderator',id,input.moderationAction||'resolve',input.note||'');break;
   }
  }
  return NextResponse.json({ok:true});
 } catch(error) {return NextResponse.json({error:error instanceof z.ZodError?'Invalid input':error instanceof Error?error.message.slice(0,500):'Action failed'},{status:400});}
}
