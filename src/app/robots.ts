import type { MetadataRoute } from "next";
import { publication } from "@/lib/publication";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/", "/search", "/reading-list", "/readers/"],
    },
    sitemap: `${publication.url}/sitemap.xml`,
  };
}
