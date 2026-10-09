import type { Metadata, Viewport } from 'next';
import { Header,Footer } from '@/components/shell';
import { publication } from '@/lib/publication';
import './globals.css';
export const dynamic='force-dynamic';
export const metadata:Metadata={metadataBase:new URL(publication.url),title:{default:`${publication.name} — Fictional news from 3026`,template:`%s | ${publication.name}`},description:publication.fiction,openGraph:{title:publication.name,description:publication.fiction,type:'website',images:[{url:'/opengraph-image',width:1200,height:630,alt:'The Tomorrow Times — fictional news, one thousand years ahead'}]},twitter:{card:'summary_large_image',description:publication.fiction},icons:{icon:'/favicon.svg'}};
export const viewport:Viewport={width:'device-width',initialScale:1,themeColor:'#f4f1e8'};
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="en"><body><a className="skip-link" href="#main">Skip to content</a><Header/><main id="main" className="main-container">{children}</main><Footer/></body></html>;}
