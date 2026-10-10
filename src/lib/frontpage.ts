import type { Article } from "./contracts";
import type { PublicEntity } from "./queries";

// Curation uses published records only. No topic selection implies audience popularity.
export const entertainmentIds = [
  "lyra-after-the-lights",
  "teo-voss-room-tone",
  "a-credit-is-not-a-confession",
  "the-crew-contract",
  "what-a-delay-sounds-like",
];
export const crimeIds = [
  "a-captain-and-a-consignee",
  "the-name-on-the-manifest",
  "leena-moss-keeps-two-lists",
  "a-warrant-doesnt-travel-by-itself",
];
export const widerReachIds = [
  "the-water-that-isnt-there",
  "a-signal-without-a-name",
  "four-three-and-a-loose-question",
  "the-fine-print-of-passage",
  "the-bean-plant-question",
  "one-more-supper-on-ceres",
  "the-night-oven",
  "cato-bells-last-pass",
  "the-oven-minutes",
  "the-path-through-the-reeds",
  "cold-storage-warm-arguments",
];
export function selectArticles(articles: Article[], ids: string[]) {
  return ids.flatMap(
    (id) => articles.find((a) => a.id === id && a.status === "published") || [],
  );
}
export function entertainmentArticles(articles: Article[]) {
  const selected = selectArticles(articles, entertainmentIds);
  return [
    ...selected,
    ...articles.filter(
      (a) =>
        a.status === "published" &&
        a.section === "entertainment" &&
        !entertainmentIds.includes(a.id),
    ),
  ];
}
export function peopleToWatch(articles: Article[], entities: PublicEntity[]) {
  const published = articles.filter((a) => a.status === "published");
  return entities
    .filter(
      (e) =>
        e.kind === "person" &&
        ["lyra", "teo", "mara", "tavi", "pema", "cato"].includes(e.id),
    )
    .map((e) => ({
      ...e,
      reports: published.filter((a) => a.entityIds.includes(e.id)).length,
      latest:
        published
          .filter((a) => a.entityIds.includes(e.id))
          .map((a) => a.publishedFiction || "")
          .sort()
          .at(-1) || "",
    }))
    .filter((e) => e.reports > 0)
    .sort(
      (a, b) =>
        b.latest.localeCompare(a.latest) ||
        b.reports - a.reports ||
        a.name.localeCompare(b.name),
    );
}
