import { notFound } from "next/navigation";
import Link from "next/link";
import { publishedEvents, relatedArticles } from "@/lib/queries";
import { PageHeading, StoryList } from "@/components/editorial";
import { displayDate } from "@/lib/calendar";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return {
    title:
      publishedEvents().find((e) => e.id === id)?.title || "Event not found",
    alternates: { canonical: `/events/${id}` },
  };
}
export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = publishedEvents().find((e) => e.id === id);
  if (!event) notFound();
  return (
    <>
      <PageHeading
        kicker={`CANONICAL RECORD / ${displayDate(event.date, true)}`}
        title={event.title}
        description="Established facts from the fictional public record."
      />
      <div className="prose">
        <h2>What is established</h2>
        <ul>
          {event.facts.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
        {event.allegations.length > 0 && (
          <>
            <h2>Allegations requiring evidence</h2>
            <ul>
              {event.allegations.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </>
        )}
        <p>
          <Link href={`/storylines/${event.storylineId}`}>
            Return to the storyline →
          </Link>
        </p>
      </div>
      <StoryList
        articles={relatedArticles(event.storylineId, "storyline").filter((a) =>
          a.eventIds.includes(event.id),
        )}
      />
    </>
  );
}
