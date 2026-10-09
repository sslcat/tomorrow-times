import { ImageResponse } from 'next/og';
import { publication } from '@/lib/publication';
export const alt='The Tomorrow Times · All reporting is fictional';
export const size={width:1200,height:630};
export const contentType='image/png';
export default function Image(){return new ImageResponse(<div style={{background:'#f5f2e9',color:'#243c32',width:'100%',height:'100%',display:'flex',flexDirection:'column',justifyContent:'center',padding:75,borderTop:'18px solid #29473c'}}><div style={{fontSize:22,letterSpacing:5,color:'#aa412d',marginBottom:28}}>ALL REPORTING IS FICTIONAL</div><div style={{fontSize:77,fontWeight:700,lineHeight:1.1}}>{publication.name}</div><div style={{fontSize:34,marginTop:25}}>{publication.tagline}</div><div style={{fontSize:22,marginTop:60,borderTop:'1px solid #a7afa2',paddingTop:25}}>An evolving science-fiction universe. Independent voices. Shared worlds.</div></div>,size);}
