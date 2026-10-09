import Link from 'next/link';
import Image from 'next/image';
import type { Article } from '@/lib/contracts';
import { sectionName } from '@/lib/contracts';
import { displayDate } from '@/lib/calendar';
import { localArt } from '@/lib/providers';
export function Art({name,priority=false,className=''}:{name:Article['art'];priority?:boolean;className?:string}) {const art=localArt.resolve(name);return <Image className={`editorial-art ${className}`} src={art.src} alt={art.alt} width={1200} height={780} priority={priority} unoptimized/>;}
export function ArticleCard({article:a,image=false,large=false}:{article:Article;image?:boolean;large?:boolean}) {return <article className={`article-card ${large?'large':''}`}>{image&&<Link href={`/articles/${a.id}`} tabIndex={-1} aria-hidden="true"><Art name={a.art}/></Link>}<p className="eyebrow"><Link href={`/sections/${a.section}`}>{sectionName(a.section)}</Link><span> / {a.format}</span></p><h2><Link href={`/articles/${a.id}`}>{a.title}</Link></h2><p className="dek">{a.dek}</p><p className="byline">{a.publishedFiction&&displayDate(a.publishedFiction)} <span>· {Math.max(1,Math.ceil(a.body.join(' ').split(/\s+/).length/200))} min read</span></p></article>;}
export function StoryList({articles}:{articles:Article[]}) {return <div className="story-list">{articles.map(a=><article key={a.id}><div><p className="eyebrow">{sectionName(a.section)} <span> / {a.format}</span></p><h3><Link href={`/articles/${a.id}`}>{a.title}</Link></h3><p>{a.dek}</p><p className="byline">{a.publishedFiction&&displayDate(a.publishedFiction)}</p></div><Link href={`/articles/${a.id}`} tabIndex={-1} aria-hidden="true"><Art name={a.art}/></Link></article>)}</div>;}
export function PageHeading({kicker,title,description}:{kicker:string;title:string;description?:string}) {return <header className="page-heading"><p className="eyebrow">{kicker}</p><h1>{title}</h1>{description&&<p>{description}</p>}</header>;}
