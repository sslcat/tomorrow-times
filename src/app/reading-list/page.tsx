import { allArticles,allEntities,allStorylines } from '@/lib/queries';
import { PageHeading } from '@/components/editorial';
import { ReadingList } from '@/components/reader-tools';
export const metadata={title:'Your reading list',robots:{index:false,follow:true}};
export default function Saved(){return <><PageHeading kicker="YOUR CORNER OF THE REACH" title="A story for later." description="Saved articles and familiar names, kept on this browser. No account needed."/><ReadingList articles={allArticles()} followOptions={[...allEntities().map(e=>({id:e.id,name:e.name,href:`/entities/${e.id}`})),...allStorylines().map(s=>({id:s.id,name:s.title,href:`/storylines/${s.id}`}))]}/></>;}
