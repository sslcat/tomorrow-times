import Link from "next/link";
import { notFound } from "next/navigation";
import { getEntity, allStorylines, relatedArticles } from "@/lib/queries";
import { PageHeading, StoryList } from "@/components/editorial";
import { SaveButton } from "@/components/reader-tools";
import { ageOn, fictionalDate } from "@/lib/calendar";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const e = getEntity(id);
  return {
    title: e?.name || "Profile not found",
    description: `Fictional universe profile. ${e?.summary || ""}`,
    alternates: { canonical: `/entities/${id}` },
  };
}
export default async function EntityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const e = getEntity((await params).id);
  if (!e) notFound();
  const home = e.home ? getEntity(e.home) : null;
  const stories = allStorylines().filter((s) => s.participants.includes(e.id));
  const articles = relatedArticles(e.id, "entity");
  return (
    <>
      <PageHeading
        kicker={`UNIVERSE INDEX / ${e.kind}`}
        title={e.name}
        description={e.summary}
      />
      <div className="profile-intro">
        <div>
          {e.kind === "person" && (
            <div className="monogram" aria-hidden="true">
              {e.name
                .split(/[ -]/)
                .map((w) => w[0])
                .slice(0, 2)
                .join("")}
            </div>
          )}
          <p className="biography">{e.biography}</p>
          <div className="entity-chips">
            <SaveButton id={e.id} kind="follows" />
          </div>
        </div>
        <div className="fact-box">
          <p className="eyebrow">IN THE PUBLIC RECORD</p>
          <dl>
            {e.occupation && (
              <>
                <dt>Occupation</dt>
                <dd>{e.occupation}</dd>
              </>
            )}
            {home && (
              <>
                <dt>Home</dt>
                <dd>
                  <Link href={`/entities/${home.id}`}>{home.name}</Link>
                </dd>
              </>
            )}
            {e.birthDate && (
              <>
                <dt>Calendar age</dt>
                <dd>
                  {ageOn(e.birthDate, fictionalDate())} · born {e.birthDate}
                </dd>
              </>
            )}
            {e.circumstance && (
              <>
                <dt>Current circumstances</dt>
                <dd>{e.circumstance}</dd>
              </>
            )}
          </dl>
          <p className="small muted">
            Fictional profile. Updated through reviewed canonical events.
          </p>
        </div>
      </div>
      {stories.length > 0 && (
        <>
          <h2 className="section-title">Part of the story</h2>
          <div className="entity-chips">
            {stories.map((s) => (
              <Link key={s.id} className="chip" href={`/storylines/${s.id}`}>
                {s.title} →
              </Link>
            ))}
          </div>
        </>
      )}
      <h2 className="section-title">In the news</h2>
      {articles.length ? (
        <StoryList articles={articles} />
      ) : (
        <div className="empty-state">
          <h3>A place in the world. A story still to come.</h3>
          <p>No reporting has yet been published about this profile.</p>
        </div>
      )}
      <h2 className="section-title">At the reader’s table</h2>
      <div className="entity-chips">
        {articles.slice(0, 4).map((a) => (
          <Link
            key={a.id}
            className="chip"
            href={`/community/discussion-${a.id}`}
          >
            {a.title} ↗
          </Link>
        ))}
      </div>
    </>
  );
}
