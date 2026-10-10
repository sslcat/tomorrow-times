import Link from "next/link";
import {
  allArticles,
  allEntities,
  allStorylines,
  publishedEvents,
  standings,
} from "@/lib/queries";
import { ArticleCard } from "@/components/editorial";
import { HeroStory, PeopleToWatch, SectionHeading } from "@/components/network";
import {
  entertainmentArticles,
  crimeIds,
  selectArticles,
  widerReachIds,
} from "@/lib/frontpage";
import { displayDate } from "@/lib/calendar";
export const metadata = { alternates: { canonical: "/" } };
export default function Home() {
  const articles = allArticles();
  const entertainment = entertainmentArticles(articles);
  const lead = entertainment[0];
  const entities = allEntities();
  const events = publishedEvents();
  const lines = allStorylines();
  return (
    <>
      <div className="edition-strip">
        <span>
          <span className="edition-dot" /> THE COMMON REACH{" "}
          <span className="muted"> / Opening edition · 5–9 October 3026</span>
        </span>
        <Link href="/archives">Edition archive ↗</Link>
      </div>
      <div className="front-intro">
        <p>
          Famous across worlds.
          <br className="mobile-break" /> <span>Human everywhere.</span>
        </p>
        <span className="network-tag">
          CULTURE. CONSEQUENCES. COSMIC DISTANCE.
        </span>
      </div>
      <section className="spotlight-grid" aria-label="Top stories">
        {lead && <HeroStory article={lead} />}
        <aside className="spotlight-side">
          <p className="rail-label">
            IN THE ORBIT <span>01—02</span>
          </p>
          {entertainment.slice(1, 3).map((a, i) => (
            <ArticleCard key={a.id} article={a} image={i === 0} />
          ))}
        </aside>
      </section>
      <nav className="topic-strip" aria-label="Editor-selected topics">
        <span>FOLLOW THE STORY</span>
        <Link href="/storylines/a-room-for-lyra">Lyra & Teo ↗</Link>
        <Link href="/storylines/sealed-cargo">The detained freighter ↗</Link>
        <Link href="/storylines/the-long-season">The tether dispute ↗</Link>
        <Link href="/storylines/under-the-ice">Europa’s signal ↗</Link>
      </nav>
      <section
        className="entertainment-block"
        aria-label="Entertainment and culture"
      >
        <SectionHeading
          kicker="BEYOND THE SPOTLIGHT"
          title="The show. The work. The fallout."
          href="/sections/entertainment"
          link="All entertainment"
        />
        <div className="culture-grid">
          <div className="culture-main">
            {entertainment[3] && (
              <ArticleCard article={entertainment[3]} image />
            )}
          </div>
          <div className="culture-secondary">
            {entertainment[4] && <ArticleCard article={entertainment[4]} />}
            <Link
              className="storyline-teaser"
              href="/storylines/a-room-for-lyra"
            >
              <span className="eyebrow">THE FULL TIMELINE</span>
              <h3>
                One partnership.
                <br />
                Two solo spotlights.
              </h3>
              <p>
                The recording, the postponement, and the questions still open.
              </p>
              <span className="text-link">Catch up on Lyra & Teo ↗</span>
            </Link>
          </div>
        </div>
      </section>
      <PeopleToWatch articles={articles} entities={entities} />
      <section className="crime-section" aria-label="Crime and investigations">
        <SectionHeading
          kicker="THE CASE FILE"
          title="A ship detained. A story unfinished."
          href="/sections/crime"
          link="Crime & justice"
        />
        <div className="case-grid">
          {selectArticles(articles, crimeIds).map((a, i) => (
            <ArticleCard key={a.id} article={a} image={i === 0} />
          ))}
        </div>
      </section>
      <section className="reach-news" aria-label="News across the Reach">
        <SectionHeading
          kicker="THE WORLDS KEEP TURNING"
          title="Away from the spotlight"
          href="/archives"
          link="All reporting"
        />
        <div className="reach-news-grid">
          {selectArticles(articles, widerReachIds)
            .slice(0, 6)
            .map((a, i) => (
              <ArticleCard key={a.id} article={a} image={i < 3} />
            ))}
        </div>
      </section>
      <section className="reach-map" aria-label="Across the Reach">
        <div className="reach-map-intro">
          <p className="eyebrow">TEN WORLDS. SHARED CONSEQUENCES.</p>
          <h2>
            Across
            <br />
            the Reach<span>.</span>
          </h2>
          <p>
            Follow the places behind the headlines. Signals travel fast. People
            take the long way.
          </p>
          <Link href="/universe?kind=location" className="text-link">
            Explore every place ↗
          </Link>
        </div>
        <div className="world-dispatches">
          {["luna", "ceres", "ares", "europa"].map((id, i) => {
            const place = entities.find((e) => e.id === id);
            const latest = events.filter((e) => e.locationId === id).at(-1);
            return (
              place && (
                <article key={id}>
                  <span
                    className={`world-sphere sphere-${id}`}
                    aria-hidden="true"
                  />
                  <div>
                    <p className="eyebrow">
                      0{i + 1} /{" "}
                      <Link href={`/entities/${id}`}>{place.name}</Link>
                    </p>
                    {latest ? (
                      <>
                        <h3>
                          <Link href={`/events/${latest.id}`}>
                            {latest.title}
                          </Link>
                        </h3>
                        <time dateTime={latest.date}>
                          {displayDate(latest.date)}
                        </time>
                      </>
                    ) : (
                      <p>No published dispatch yet.</p>
                    )}
                  </div>
                  <Link
                    href={`/entities/${id}`}
                    aria-label={`Explore ${place.name}`}
                  >
                    ↗
                  </Link>
                </article>
              )
            );
          })}
        </div>
      </section>
      <section className="news-bottom">
        <div>
          <SectionHeading
            kicker="ORDINARY LIFE, EXTRAORDINARY PLACES"
            title="A little closer to home"
          />
          <div className="two-grid">
            {selectArticles(articles, widerReachIds)
              .slice(6)
              .map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
          </div>
        </div>
        <aside className="league-panel">
          <p className="eyebrow">REACH SIX / TETHERBALL</p>
          <h2>Every point counts.</h2>
          <table>
            <caption className="small">
              Opening round · recorded results
            </caption>
            <thead>
              <tr>
                <th>Club</th>
                <th scope="col">P</th>
                <th scope="col">Pts</th>
              </tr>
            </thead>
            <tbody>
              {standings()
                .slice(0, 3)
                .map((t) => (
                  <tr key={t.id}>
                    <th scope="row">
                      <Link href={`/entities/${t.id}`}>{t.name}</Link>
                    </th>
                    <td>{t.played}</td>
                    <td>{t.points}</td>
                  </tr>
                ))}
            </tbody>
          </table>
          <p className="small muted">
            Three clubs have yet to play. Table calculated from published match
            results.
          </p>
          <Link className="text-link" href="/sections/sports">
            Scores & standings ↗
          </Link>
        </aside>
      </section>
      <section className="continuing-section">
        <SectionHeading
          kicker="PICK UP WHERE THE WORLD LEFT OFF"
          title="Stories with a next chapter"
          href="/storylines"
          link="Every storyline"
        />
        <div className="storyline-links">
          {[...lines]
            .sort(
              (a, b) =>
                Number(b.id === "a-room-for-lyra") -
                Number(a.id === "a-room-for-lyra"),
            )
            .slice(0, 4)
            .map((s, i) => (
              <Link key={s.id} href={`/storylines/${s.id}`}>
                <span>0{i + 1}</span>
                <div>
                  <p className="eyebrow">{s.status}</p>
                  <h3>{s.title}</h3>
                  <p>{s.summary}</p>
                </div>
                <b>↗</b>
              </Link>
            ))}
        </div>
      </section>
      <section className="community-banner">
        <span className="community-mark" aria-hidden="true">
          ↗
        </span>
        <div>
          <p className="eyebrow">THE READER’S TABLE</p>
          <h2>
            The news is fictional.
            <br />
            Your curiosity is real.
          </h2>
          <p>
            Browse the article discussions. This edition is read-only; no reader
            activity is simulated.
          </p>
        </div>
        <Link className="button outline" href="/community">
          Find your discussion ↗
        </Link>
      </section>
    </>
  );
}
