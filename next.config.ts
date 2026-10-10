import type { NextConfig } from "next";
import { assertHostingMode, showcaseEnabled } from "./src/lib/runtime-mode";
assertHostingMode();
const isDev = process.env.NODE_ENV === "development";
const config: NextConfig = {
  devIndicators: false,
  allowedDevOrigins:
    process.env.CODESPACE_NAME &&
    process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN
      ? [
          `${process.env.CODESPACE_NAME}-3000.${process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}`,
        ]
      : [],
  serverExternalPackages: ["better-sqlite3"],
  outputFileTracingIncludes: showcaseEnabled()
    ? { "/*": ["./.showcase/published.sqlite"] }
    : undefined,
  outputFileTracingExcludes: {
    "/*": [
      "./data/**/*",
      "./backups/**/*",
      "./artifacts/**/*",
      "./.env*",
      "./.git/**/*",
    ],
  },
  poweredByHeader: false,
  images: { unoptimized: true },
  experimental: { cpus: 2 },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          ...(process.env.VERCEL_ENV === "preview"
            ? [{ key: "X-Robots-Tag", value: "noindex, nofollow" }]
            : []),
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: `default-src 'self'; script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'${isDev ? " ws: wss:" : ""}; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'`,
          },
        ],
      },
    ];
  },
};
export default config;
