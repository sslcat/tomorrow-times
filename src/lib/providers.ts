import { z } from 'zod';
import type { CanonEvent, Draft, Entity, Storyline } from './contracts';
export type NewsroomContext={ date:string; entities:Entity[]; storylines:Storyline[]; events:CanonEvent[] };
export interface NewsProvider { readonly name:string; readonly paid:boolean; estimateCents():number; propose(context:NewsroomContext):Promise<unknown>; draft(event:CanonEvent):Promise<unknown> }
export interface ImageProvider { readonly paid:boolean; resolve(reference: string): {src:string;alt:string;license:string;estimatedCents:number} }
export const localArt: ImageProvider={paid:false,resolve(reference){const id=z.enum(['mars','signal','stage','sport','habitat','cargo']).parse(reference);return {src:`/art/${id}.svg`,alt:{mars:'Original illustration of a terraced Martian reservoir city',signal:'Original illustration of a listening station above Europa’s ice',stage:'Original illustration of a quiet concert stage',sport:'Original illustration of a tetherball cage',habitat:'Original illustration of a warm habitat window and a plant',cargo:'Original illustration of a cargo vessel at a transfer dock'}[id],license:'Original Tomorrow Times SVG illustration, included with source',estimatedCents:0};}};
export class OfflineProvider implements NewsProvider {
 name='Curated offline desk';paid=false;estimateCents(){return 0;}
 async propose(context:NewsroomContext) {
  const id=`rota-review-${context.date}`;
  return {id,fingerprint:id,title:'Neighbors agree to review the Daro meal rota together',date:context.date,locationId:'ceres',jurisdiction:'ceres',participants:['ada','hana','rue'],storylineId:'a-place-at-the-table',causes:['care-rota'],facts:['Ada Daro and her neighbors agreed to review the meal rota after its first week.','Ada will keep control over which visits she accepts.'],allegations:[],effects:[{type:'state',entityId:'ada',key:'circumstance',value:'A weekly meal rota is in place, with a joint review agreed.'}],rules:{ftl:false}};
 }
 async draft(e:CanonEvent):Promise<Draft> {
  return {id:`${e.id}-report`,title:'A care plan with room to change',dek:'Ada Daro and her neighbors add a review to their meal rota, keeping the agreement in the hands of the person it is meant to help.',section:'local',format:'Report',authorId:'rue',body:[e.facts[0], 'The agreement gives the neighbors a chance to discuss what has worked and what needs changing. It does not alter the Daro family’s housing status or set a new departure date.',e.facts[1], 'A small arrangement can become a large obligation if nobody knows how to revise it. Naming a review now makes adjustment part of the promise, rather than a failure to keep it.'],eventIds:[e.id],entityIds:['ada','hana','rue','ceres'],storylineId:e.storylineId,art:'habitat',claims:e.facts.map(fact=>({eventId:e.id,fact}))};
 }
}
// A provider seam, not a hidden integration: enabling remote calls requires a separately reviewed implementation.
export function provider(mode=process.env.NEWSROOM_MODE||'offline'):NewsProvider {
 if(!['offline','editor'].includes(mode))throw new Error('Remote providers and unattended generation are disabled in this release');
 return new OfflineProvider();
}
export async function bounded<T>(work:()=>Promise<T>,attempts=2,timeoutMs=5000):Promise<T> {
 const count=Math.min(Math.max(attempts,1),2);
 for(let i=0;i<count;i++) {
  let timer:ReturnType<typeof setTimeout>|undefined;
  try {return await Promise.race([work(),new Promise<never>((_,reject)=>{timer=setTimeout(()=>reject(new Error('Provider timeout')),timeoutMs);})]);}
  catch(error){if(i===count-1)throw error;}
  finally{clearTimeout(timer);}
 }
 throw new Error('Provider failed');
}
