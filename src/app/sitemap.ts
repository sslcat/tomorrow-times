import type { MetadataRoute } from "next";
import {
  allArticles,
  allEntities,
  allStorylines,
  publishedEvents,
} from "@/lib/queries";
import { sections } from "@/lib/contracts";
import { publication } from "@/lib/publication";
export const dynamic = "force-dynamic";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...["", "/about", "/universe", "/storylines", "/archives", "/community"],
    ...sections.map(([id]) => `/sections/${id}`),
    ...allArticles().map((a) => `/articles/${a.id}`),
    ...allEntities().map((e) => `/entities/${e.id}`),
    ...allStorylines().map((s) => `/storylines/${s.id}`),
    ...publishedEvents().map((e) => `/events/${e.id}`),
  ].map((path) => ({
    url: `${publication.url}${path}`,
    changeFrequency: path === "" ? "daily" : "weekly",
  }));
}
