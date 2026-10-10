import type { MetadataRoute } from "next";
import { publication } from "@/lib/publication";
export const dynamic = "force-dynamic";
export default function robots(): MetadataRoute.Robots {
  if (process.env.VERCEL_ENV === "preview") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/", "/search", "/reading-list", "/readers/"],
    },
    sitemap: `${publication.url}/sitemap.xml`,
  };
}
