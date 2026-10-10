import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getEntity,
  allEntities,
  allStorylines,
  relatedArticles,
  publishedEvents,
} from "@/lib/queries";
import { PageHeading, StoryList } from "@/components/editorial";
import { SaveButton } from "@/components/reader-tools";
import { ageOn, fictionalDate, displayDate } from "@/lib/calendar";
import { Portrait, EditorialImage } from "@/components/editorial-image";
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
  const events = publishedEvents().filter(
    (event) => event.participants.includes(e.id) || event.locationId === e.id,
  );
  const collaborators = allEntities().filter(
    (person) =>
      person.kind === "person" &&
      person.id !== e.id &&
      events.some((event) => event.participants.includes(person.id)),
  );
  return (
    <>
      <PageHeading
        kicker={`UNIVERSE INDEX / ${e.kind}`}
        title={e.name}
        description={e.summary}
      />
      <div className="profile-intro">
        <div className="profile-identity">
          {e.kind === "person" ? (
            <Portrait id={e.id} name={e.name} large />
          ) : (
            <EditorialImage
              id={e.id}
              label={e.name}
              section={e.kind === "location" ? "science" : "business"}
            />
          )}
          <div>
            <p className="biography">{e.biography}</p>
            {e.kind === "person" && (
              <p className="small muted">
                Fictional public profile · {articles.length} published reports.
                Portrait reference awaiting approval.
              </p>
            )}
            <div className="entity-chips">
              <SaveButton id={e.id} kind="follows" />
            </div>
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
      {events.length > 0 && (
        <section className="section-layout">
          <div>
            <h2 className="section-title">Life in the public record</h2>
            <div className="timeline">
              {events.map((event) => (
                <article key={event.id}>
                  <time dateTime={event.date}>{displayDate(event.date)}</time>
                  <h3>
                    <Link href={`/events/${event.id}`}>{event.title}</Link>
                  </h3>
                  <p>{event.facts[0]}</p>
                </article>
              ))}
            </div>
          </div>
          <aside>
            <h2 className="section-title">Connected people</h2>
            <div className="fact-box">
              <p>
                People named in the same published events. A shared story does
                not establish a private relationship.
              </p>
              <div className="entity-chips">
                {collaborators.map((person) => (
                  <Link
                    className="chip"
                    key={person.id}
                    href={`/entities/${person.id}`}
                  >
                    {person.name} ↗
                  </Link>
                ))}
              </div>
              {e.id === "lyra" || e.id === "teo" ? (
                <p className="small muted">
                  Creative collaborators. No romantic relationship or split is
                  confirmed in the published reporting.
                </p>
              ) : null}
            </div>
          </aside>
        </section>
      )}
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
