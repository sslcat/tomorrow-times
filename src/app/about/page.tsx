import { PageHeading } from "@/components/editorial";
import { publication } from "@/lib/publication";
import { world } from "@/data/world";
export const metadata = {
  title: "About this fictional newspaper",
  alternates: { canonical: "/about" },
};
export default function About() {
  return (
    <>
      <PageHeading
        kicker="A NOTE FROM THE EDITORS"
        title="A thousand years ahead. Still human."
        description={publication.fiction}
      />
      <div className="prose">
        <p>
          {publication.name} is a persistent science-fiction publication. Its
          journalists write from within the Common Reach, a civilization
          connected by ships, delayed messages and unfinished agreements. This
          is an original fictional world, not real-world reporting or a
          prediction service.
        </p>
        <h2>A world with consequences</h2>
        <p>
          People have histories. Decisions change lives. A match result stays in
          the league table, a delayed journey stays delayed until the story
          advances, and an allegation remains an allegation until the record
          supports more.
        </p>
        <h2>How to read this edition</h2>
        <p>
          Start with a report, follow a person’s name or open a storyline
          timeline. News, analysis and opinion are labeled. “Developing”
          describes a fictional storyline’s status, not a live feed. The opening
          edition is curated; new publication requires an editor’s approval.
        </p>
        <h2>The calendar</h2>
        <p>
          The masthead follows the real calendar shifted exactly one thousand
          years in the editorial time zone. February 29 becomes February 28 when
          the destination year is not a leap year. Original article dates are
          preserved. A new day does not silently create a new article.
        </p>
        <h2>The rules of the Reach</h2>
        {Object.entries(world.rules).map(([key, value]) => (
          <p key={key}>
            <strong>{key.charAt(0).toUpperCase() + key.slice(1)}.</strong>{" "}
            {typeof value === "boolean"
              ? "There is no faster-than-light travel or communication."
              : value}
          </p>
        ))}
        <h2>Corrections and trust</h2>
        <p>
          Published corrections carry a visible note. Retractions preserve the
          historical text with a clear label. Editorial changes and canonical
          events have an audit trail. All illustrations are original local SVG
          artwork; no image is presented as a photograph of a real event.
        </p>
        <h2>The reader’s table</h2>
        <p>
          The community is for real readers discussing fictional news. This
          offline edition is read-only: no reader accounts, conversations or
          popularity are invented. Posting will require verified authentication,
          active moderation and abuse controls before a public launch. Reader
          theories will never automatically become canon.
        </p>
        <h2>Your preferences</h2>
        <p>
          Bookmarks and follows stay in your browser’s local storage. Clearing
          site data removes them. This edition uses no analytics, advertising
          trackers or external fonts.
        </p>
      </div>
    </>
  );
}
