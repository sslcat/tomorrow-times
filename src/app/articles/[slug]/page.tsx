import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getArticle,
  allEntities,
  getStoryline,
  relatedArticles,
  correctionHistory,
} from "@/lib/queries";
import { sectionName } from "@/lib/contracts";
import { displayDate } from "@/lib/calendar";
import { Art, ArticleCard } from "@/components/editorial";
import {
  SaveButton,
  ReadingProgress,
  ShareButton,
} from "@/components/reader-tools";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return { title: "Article not found" };
  return {
    title: a.title,
    description: `Fictional reporting. ${a.dek}`,
    alternates: { canonical: `/articles/${a.id}` },
    openGraph: {
      title: `FICTION · ${a.title}`,
      description: `All events are fictional. ${a.dek}`,
      type: "article",
      publishedTime: a.publishedReal || undefined,
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    },
  };
}
function LinkedParagraph({
  text,
  names,
}: {
  text: string;
  names: { id: string; name: string }[];
}) {
  const matches = names.filter((n) => text.includes(n.name));
  if (!matches.length) return <>{text}</>;
  const first = matches.sort(
    (a, b) => text.indexOf(a.name) - text.indexOf(b.name),
  )[0];
  const i = text.indexOf(first.name);
  return (
    <>
      {text.slice(0, i)}
      <Link href={`/entities/${first.id}`}>{first.name}</Link>
      <LinkedParagraph
        text={text.slice(i + first.name.length)}
        names={names.filter((n) => n.id !== first.id)}
      />
    </>
  );
}
export default async function ArticlePage({ params }: Props) {
  const a = getArticle((await params).slug);
  if (!a) notFound();
  const entities = allEntities();
  const author = entities.find((e) => e.id === a.authorId);
  const line = getStoryline(a.storylineId)!;
  const related = relatedArticles(a.storylineId, "storyline")
    .filter((r) => r.id !== a.id)
    .slice(0, 3);
  const corrections = correctionHistory(a.id);
  return (
    <>
      <ReadingProgress />
      <header className="article-header">
        <p className="eyebrow">
          <Link href={`/sections/${a.section}`}>{sectionName(a.section)}</Link>{" "}
          <span> / {a.format}</span>
        </p>
        <span className="fiction-label">
          Fictional reporting · From the world of 3026
        </span>
        <h1>{a.title}</h1>
        <p className="standfirst">{a.dek}</p>
        <div className="article-meta">
          <div>
            <p>
              By{" "}
              <Link href={`/entities/${a.authorId}`}>
                <strong>{author?.name}</strong>
              </Link>
            </p>
            <p className="muted">
              <time dateTime={a.publishedFiction || undefined}>
                {a.publishedFiction && displayDate(a.publishedFiction, true)}
              </time>{" "}
              ·{" "}
              {Math.max(
                1,
                Math.ceil(a.body.join(" ").split(/\s+/).length / 200),
              )}{" "}
              min read
            </p>
          </div>
          <div className="article-actions">
            <SaveButton id={a.id} />
            <ShareButton />
          </div>
        </div>
      </header>
      {a.status === "retracted" && (
        <div className="note" role="status">
          This article has been retracted. The original text remains visible for
          the historical record. See the editorial note below.
        </div>
      )}
      <figure className="article-figure">
        <Art name={a.art} priority />
        <figcaption>
          Original editorial illustration. Depicts a fictional world; this is
          not documentary imagery.
        </figcaption>
      </figure>
      <div className="article-layout">
        <div className="article-body" id="article-body">
          {a.body.map((p, i) => (
            <p key={i}>
              <LinkedParagraph
                text={p}
                names={entities.filter((e) => a.entityIds.includes(e.id))}
              />
            </p>
          ))}
        </div>
        <aside className="article-aside">
          <div>
            <p className="eyebrow">THE STORY SO FAR</p>
            <h2>
              <Link href={`/storylines/${line.id}`}>{line.title}</Link>
            </h2>
            <p>{line.summary}</p>
            <h3>Established in the record</h3>
            <ul>
              {line.facts.slice(0, 3).map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <Link className="text-link" href={`/storylines/${line.id}`}>
              Read the timeline →
            </Link>
          </div>
          <div>
            <h3>People & places</h3>
            <div className="entity-chips">
              {entities
                .filter((e) => a.entityIds.includes(e.id))
                .map((e) => (
                  <Link className="chip" href={`/entities/${e.id}`} key={e.id}>
                    {e.name}
                  </Link>
                ))}
            </div>
            <h3>Source events</h3>
            {a.eventIds.map((id) => (
              <p key={id}>
                <Link href={`/events/${id}`}>View the canonical record →</Link>
              </p>
            ))}
          </div>
        </aside>
      </div>
      <div className="article-end">
        {corrections.map((c, i) => (
          <div className="note" key={i}>
            <strong>
              {c.action === "retraction" ? "Retraction" : "Correction"} ·{" "}
              {new Date(c.at).toLocaleDateString("en-US", { timeZone: "UTC" })}{" "}
              (real date)
            </strong>
            <p>{c.note}</p>
          </div>
        ))}
        <div className="note">
          <h3>Join the reader’s table</h3>
          <p>
            Discuss the reporting, compare theories, follow the questions.
            Reader discussion is separate from the fictional canon.
          </p>
          {a.status === "published" && (
            <Link className="text-link" href={`/community/discussion-${a.id}`}>
              Open this article’s discussion →
            </Link>
          )}
          <p className="small muted">
            Read-only offline edition. Posting is disabled.
          </p>
        </div>
      </div>
      <section>
        <div className="section-heading">
          <h2>Keep following the story</h2>
        </div>
        <div className="three-grid">
          {related.map((r) => (
            <ArticleCard key={r.id} article={r} image />
          ))}
        </div>
      </section>
    </>
  );
}
