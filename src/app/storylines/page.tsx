import Link from 'next/link';
import { allStorylines } from '@/lib/queries';
import { PageHeading } from '@/components/editorial';
export const metadata={title:'Follow the story',alternates:{canonical:'/storylines'}};
export default function Storylines(){return <><PageHeading kicker="THE CONTINUING STORIES" title="Start anywhere. Stay for the people." description="Eight connected threads through the Common Reach. Catch up on what happened, what is known, and what remains unresolved."/><div className="profile-grid">{allStorylines().map(s=><article className="profile-card" key={s.id}><p className="eyebrow">{s.status}</p><h2><Link href={`/storylines/${s.id}`}>{s.title}</Link></h2><p>{s.summary}</p><Link className="text-link" href={`/storylines/${s.id}`}>Previously, in the Reach →</Link></article>)}</div></>;}
