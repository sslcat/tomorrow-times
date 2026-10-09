import Link from "next/link";
import { allEntities } from "@/lib/queries";
import { PageHeading } from "@/components/editorial";
export const metadata = {
  title: "People, places & institutions",
  alternates: { canonical: "/universe" },
};
export default async function Universe({
  searchParams,
}: {
  searchParams: Promise<{ kind?: string }>;
}) {
  const { kind = "person" } = await searchParams;
  const selected = ["person", "location", "organization"].includes(kind)
    ? kind
    : "person";
  const entities = allEntities().filter((e) => e.kind === selected);
  return (
    <>
      <PageHeading
        kicker="A FIELD GUIDE TO THE COMMON REACH"
        title="Every name has a story."
        description="Meet the recurring people, inhabited worlds and institutions behind the reporting. Their lives continue between editions."
      />
      <nav className="filters" aria-label="Entity types">
        {[
          ["person", "People"],
          ["location", "Places"],
          ["organization", "Institutions"],
        ].map(([id, name]) => (
          <Link
            key={id}
            href={`/universe?kind=${id}`}
            aria-current={selected === id ? "page" : undefined}
          >
            {name}
          </Link>
        ))}
      </nav>
      <div className="profile-grid">
        {entities.map((e) => (
          <article className="profile-card" key={e.id}>
            <p className="eyebrow">{e.occupation || e.kind}</p>
            <h2>
              <Link href={`/entities/${e.id}`}>{e.name}</Link>
            </h2>
            <p>{e.summary}</p>
            <Link className="text-link" href={`/entities/${e.id}`}>
              Meet{" "}
              {e.kind === "person"
                ? e.name.split(" ")[0]
                : "the " +
                  (e.kind === "location" ? "place" : "institution")}{" "}
              →
            </Link>
          </article>
        ))}
      </div>
    </>
  );
}
