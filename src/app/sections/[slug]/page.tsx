import { notFound } from "next/navigation";
import { allArticles, standings } from "@/lib/queries";
import { sections, sectionName } from "@/lib/contracts";
import { PageHeading, StoryList } from "@/components/editorial";
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
