import { notFound } from "next/navigation";
import Link from "next/link";
import { allArticles, allEntities, standings } from "@/lib/queries";
import { sections, sectionName } from "@/lib/contracts";
import { ArticleCard, PageHeading, StoryList } from "@/components/editorial";
import { HeroStory, PeopleToWatch, SectionHeading } from "@/components/network";
import { entertainmentArticles } from "@/lib/frontpage";
const descriptions: Record<string, string> = {
  interplanetary: "Across the distance, connected by more than ships.",
  politics: "Who decides, who benefits, and who has to wait.",
  crime: "Evidence before accusation. Due process across jurisdictions.",
  business: "The prices, contracts and compromises behind everyday life.",
  science: "What we know. How we know it. What comes next.",
  entertainment: "On stage, off the record, and between the notes.",
  sports: "Every fixture counts. Every season leaves a story.",
  culture: "The ways we make a life among the worlds.",
  investigations: "Documents, patient questions and consequences.",
  opinion: "Arguments from within the world. Clearly labeled judgments.",
  local: "The neighborhood is still where the news comes home.",
  oddities: "Small surprises from a very large civilization.",
};
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return {
    title: sectionName(slug),
    description: `Fictional ${sectionName(slug).toLowerCase()} reporting from the Common Reach.`,
    alternates: { canonical: `/sections/${slug}` },
  };
}
export default async function Section({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!sections.some(([id]) => id === slug)) notFound();
  const articles = allArticles(slug);
  if (slug === "entertainment") {
    const all = allArticles();
    const coverage = entertainmentArticles(all);
    return (
      <>
        <header className="entertainment-heading">
          <div>
            <p className="eyebrow">THE COMMON REACH / CULTURE DESK</p>
            <h1>
              Entertainment<span className="muted">.</span>
            </h1>
          </div>
          <p>
            The songs. The public lives.
            <br />
            The morning after the spotlight.
          </p>
        </header>
        <nav
          className="entertainment-formats"
          aria-label="Entertainment coverage"
        >
          <a href="#music">Music & releases</a>
          <a href="#behind-the-scenes">Behind the scenes</a>
          <Link href="/storylines/a-room-for-lyra">Lyra & Teo timeline</Link>
          <Link href="/community?section=entertainment">
            Reader discussion ↗
          </Link>
        </nav>
        <section
          className="spotlight-grid"
          id="music"
          aria-label="Music and public lives"
        >
          {coverage[0] && <HeroStory article={coverage[0]} sectionPage />}
          <div className="entertainment-rail">
            {coverage.slice(1, 3).map((a) => (
              <ArticleCard
                article={a}
                key={a.id}
                image={a.id === "teo-voss-room-tone"}
              />
            ))}
          </div>
        </section>
        <section className="entertainment-block" id="behind-the-scenes">
          <SectionHeading
            kicker="THE PEOPLE WHO MAKE THE SHOW"
            title="Behind the scenes"
          />
          <div className="two-grid">
            {coverage.slice(3).map((a) => (
              <ArticleCard key={a.id} article={a} image />
            ))}
          </div>
        </section>
        <PeopleToWatch articles={all} entities={allEntities()} />
        <section className="community-banner">
          <div>
            <p className="eyebrow">THE STORY IS STILL UNFOLDING</p>
            <h2>
              Follow the work.
              <br />
              Keep the questions open.
            </h2>
            <p>
              A solo recording is not a confirmed breakup. Follow the published
              timeline, the collaborators and the next report.
            </p>
          </div>
          <Link href="/storylines/a-room-for-lyra" className="button outline">
            The Lyra & Teo timeline ↗
          </Link>
        </section>
      </>
    );
  }
  return (
    <>
      <PageHeading
        kicker="THE SECTION DESK"
        title={sectionName(slug)}
        description={descriptions[slug]}
      />
      <div className={slug === "sports" ? "section-layout" : ""}>
        <StoryList articles={articles} />
        {slug === "sports" && (
          <aside className="league-panel">
            <p className="eyebrow">REACH SIX LEAGUE</p>
            <h2>Standings</h2>
            <table>
              <caption className="small">Fictional 3026 opening round</caption>
              <thead>
                <tr>
                  <th>Club</th>
                  <th>P</th>
                  <th>GD</th>
                  <th>Pts</th>
                </tr>
              </thead>
              <tbody>
                {standings().map((t) => (
                  <tr key={t.id}>
                    <th>{t.name}</th>
                    <td>{t.played}</td>
                    <td>{t.difference}</td>
                    <td>{t.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="small muted">
              Win: 3 points. Draw: 1 point. All opening fixtures took place on
              Luna, keeping the traveling schedule feasible.
            </p>
          </aside>
        )}
      </div>
    </>
  );
}
