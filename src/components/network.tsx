import Link from "next/link";
import type { Article } from "@/lib/contracts";
import type { PublicEntity } from "@/lib/queries";
import { peopleToWatch } from "@/lib/frontpage";
import { displayDate } from "@/lib/calendar";
import { EditorialImage, Portrait } from "./editorial-image";

export function HeroStory({
  article: a,
  sectionPage = false,
}: {
  article: Article;
  sectionPage?: boolean;
}) {
  const Heading = sectionPage ? "h2" : "h1";
  return (
    <article className="hero-story">
      <EditorialImage id={a.id} label={a.title} section={a.section} hero />
      <div className="hero-topline">
        <span>THE SPOTLIGHT</span>
        <span>
          {a.storylineId === "a-room-for-lyra"
            ? "LUNA / ARES RELAY"
            : "THE COMMON REACH"}
        </span>
      </div>
      <div className="hero-copy">
        <p className="eyebrow">
          <span className="edition-dot" /> MUSIC & THE PEOPLE BEHIND IT
        </p>
        <Heading>
          <Link href={`/articles/${a.id}`}>{a.title}</Link>
        </Heading>
        <p className="hero-dek">{a.dek}</p>
        <div className="hero-bottom">
          <p className="byline">
            <time dateTime={a.publishedFiction || undefined}>
              {a.publishedFiction && displayDate(a.publishedFiction)}
            </time>{" "}
            · {a.format}
          </p>
          <Link
            href={`/articles/${a.id}`}
            className="round-link"
            aria-label={`Read: ${a.title}`}
          >
            ↗
          </Link>
        </div>
      </div>
    </article>
  );
}
export function SectionHeading({
  kicker,
  title,
  href,
  link = "Explore the desk",
}: {
  kicker: string;
  title: string;
  href?: string;
  link?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">{kicker}</p>
        <h2>{title}</h2>
      </div>
      {href && (
        <Link href={href}>
          {link} <span aria-hidden="true">↗</span>
        </Link>
      )}
    </div>
  );
}
export function PeopleToWatch({
  articles,
  entities,
}: {
  articles: Article[];
  entities: PublicEntity[];
}) {
  return (
    <section className="people-section" aria-label="People to Watch">
      <SectionHeading
        kicker="THE NAMES TO KNOW"
        title="People to Watch"
        href="/universe"
        link="Meet the cast"
      />
      <p className="module-note">
        Ordered by latest published coverage, then report count. No audience
        rankings.
      </p>
      <div className="people-grid">
        {peopleToWatch(articles, entities)
          .slice(0, 6)
          .map((e) => (
            <Link href={`/entities/${e.id}`} className="person-card" key={e.id}>
              <Portrait id={e.id} name={e.name} />
              <h3>{e.name}</h3>
              <p>{e.occupation}</p>
              <small>
                {e.reports} published reports <span aria-hidden="true">↗</span>
              </small>
            </Link>
          ))}
      </div>
    </section>
  );
}
