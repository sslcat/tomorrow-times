export function publicationUrl(
  env: Record<string, string | undefined> = process.env,
) {
  const raw =
    env.SITE_URL ||
    (env.VERCEL_URL ? `https://${env.VERCEL_URL}` : "http://localhost:3000");
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    // URL constructor errors can include the raw configuration value.
    throw new Error("SITE_URL must be a valid HTTP(S) origin");
  }
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    url.pathname !== "/"
  ) {
    throw new Error(
      "SITE_URL must be an HTTP(S) origin without credentials, path, query or fragment",
    );
  }
  if (
    env.VERCEL === "1" &&
    (url.protocol !== "https:" ||
      ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname))
  ) {
    throw new Error("Vercel requires a public HTTPS metadata origin");
  }
  return url.origin;
}

export const publication = {
  name: process.env.NEXT_PUBLIC_PUBLICATION_NAME || "The Tomorrow Times",
  tagline:
    process.env.NEXT_PUBLIC_PUBLICATION_TAGLINE ||
    "Tomorrow’s News. A Thousand Years Early.",
  url: publicationUrl(),
  fiction:
    "An independent fictional newspaper from a thousand years ahead. All people, events and reporting are fictional.",
};
