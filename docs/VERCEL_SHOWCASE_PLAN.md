# Vercel read-only showcase plan

Status: **PASS for local production verification; NEEDS REVIEW for hosted release**. Both builds and the 13-scenario showcase smoke suite pass; no persistent database service is required for this fixed edition. Local production checks are recorded in the [readiness report](PUBLIC_RELEASE_READINESS_REPORT.md). No Vercel project, API call, CLI deployment, domain, service, account or secret was created. Local success is not proof of a hosted deployment; the owner must authorize and review an actual preview separately.

## Feasible configuration

The current app can serve its curated opening edition without a persistent database service. It remains a dynamic Next.js Node application, not a static export. Search, query-string archives, missing-route handling and the request-time edition clock stay intact.

[Vercel functions use a read-only filesystem with temporary scratch space](https://vercel.com/docs/functions/runtimes). The writable local SQLite flow is unsuitable there. The opt-in showcase creates a build artifact from reviewed source fixtures and opens it using `readonly: true`, `fileMustExist: true` and `query_only`. It never creates a database, migrates, seeds, starts WAL, copies the working database or writes runtime news content. Missing/invalid snapshots fail closed instead of falling back to local editing mode.

`npm run build:showcase` generates `.showcase/published.sqlite` from an in-memory source seed and a separate clean target schema. Only published articles/events, public entity/storyline fields, article links, standings fixtures and official empty discussion rooms are copied. Private notes, future arcs, full canon, users, comments, reports, jobs, audits, settings and rate-limit records are absent. The artifact is ignored by Git, regenerated at build time and explicitly included in Next route traces. It is not under `public/` and direct HTTP access returns 404.

Changes made through the local editorial database do **not** flow into the showcase. Publishing new showcase content requires a separate, reviewed source-fixture update and rebuild; this is intentionally an opening-edition showcase. The full story bible and unapproved templates still exist in Git source/server code. Reader isolation is not source-code secrecy.

## Proposed project settings — owner action only

| Setting | Proposed configuration |
| --- | --- |
| Plan / purpose | Personal, non-commercial Hobby showcase; owner confirms eligibility and current limits |
| Framework | Next.js, normal Node runtime; no Edge runtime or static export |
| Node | 24.x, also pinned in `package.json`; native SQLite installed on the target platform |
| Install | `npm ci` (build tools must be installed) |
| Build | `npm run build:showcase` |
| Output directory | Next.js default; no custom output override |
| Root | Repository root |
| Environment | Enable the explicit read-only showcase flag for both build and runtime, Preview and Production |
| Integrations | None; no database, Blob, Redis, email, analytics, cron, image provider or background worker |
| Domains | Default preview URL initially; any later domain/DNS action needs separate approval |

[Vercel documents Node 24.x support](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions). The existing `better-sqlite3` package remains server-external; trace checks verify the native binary and snapshot. Next's `outputFileTracingIncludes` is the appropriate inclusion mechanism for framework-managed functions, as described in [Vercel's file-bundling guide](https://vercel.com/kb/guide/how-can-i-use-files-in-serverless-functions). A real Vercel preview must still verify its native module ABI and file packaging; this audit does not assert those were tested remotely.

Vercel builds/runs refuse the normal writable local configuration. Setting only the build command is insufficient: the showcase mode must also be enabled at runtime. Do not bypass this guard.

## Environment inventory (names only)

| Name | Role / policy |
| --- | --- |
| `SHOWCASE_MODE` | Required explicit read-only opt-in at build and runtime; exact enabled setting is shown in the committed build/start scripts |
| `EDITORIAL_TIME_ZONE` | Optional; defaults to the existing Chicago calendar; changing it is an editorial choice |
| `SITE_URL` | Optional approved HTTPS origin; never include credentials, a path, query or fragment; omit during a first preview to use the provider's deployment host |
| `VERCEL`, `VERCEL_URL`, `VERCEL_ENV` | Provider-managed context; used for mode enforcement, metadata host fallback and preview noindex |
| `NEXT_PUBLIC_PUBLICATION_NAME`, `NEXT_PUBLIC_PUBLICATION_TAGLINE` | Optional public branding; values are intentionally browser-visible and frozen at build where inlined |
| `NEXT_TELEMETRY_DISABLED` | Used by local build scripts to disable Next telemetry |
| `DATABASE_PATH` | Local editor only; ignored in showcase mode |
| `LOCAL_ADMIN_ENABLED`, `ADMIN_TOKEN`, `ADMIN_ORIGIN` | Local editor only; do not upload or create these for hosting |
| `NEWSROOM_MODE`, `SCHEDULED_NEWSROOM_ENABLED` | No remote provider or worker is connected; no deployment configuration should attempt to enable them |

No production secret is required. Do not upload `.env.local`, databases, backups, test traces or Codespaces credentials. Tracing explicitly excludes local environment files and runtime data. The `.env.example` localhost origin is for local development, not a file to bulk-import into Vercel.

## Public restrictions and limitations

- `/api/admin` rejects all POST actions before body parsing, authentication or DB access in showcase/production. Other write methods are unsupported. A configured editor token cannot unlock it. `/admin` shows a locked workspace.
- `/api/community` always denies POST; no reader identity adapter exists. There is no upload route, public server action, publication endpoint, webhook, scheduled task or worker.
- The snapshot contains no reader records. Official threads remain browsable with honest zero counts. Bookmarks/follows are browser-local only.
- Local SQLite rate limiting protects the optional development desk. The public showcase has no distributed application rate limiter. Read traffic consumes platform quotas; use available platform controls and disable the deployment if abused. Do not introduce a paid rate-limit service in this preparation task.
- All editorial art is local SVG. Image optimization is disabled; arbitrary remote image URLs are rejected. No font CDN, analytics or external content fetch is needed.
- Production CSP removes development eval/WebSockets. Inline scripts/styles remain allowed for the current Next rendering; no strict nonce-CSP claim is made. Plain text rendering and parameterized SQL remain the primary input boundaries. HSTS/TLS termination must be checked on the approved hosted preview.
- Public pages are dynamic/no-store to keep the edition date correct. This costs more function work than a static site. The small fixed corpus needs no shared database or persistent server. There is no load-test or traffic capacity guarantee.

## Calendar, caching and discovery

The root layout renders dynamically. The server computes the current editorial local date plus 1,000 **calendar years** per request; the browser recomputes every 15 seconds using the same server-provided zone. DST, year transitions and the lost February 29 in the destination year are tested. Seed article/archive timestamps never move on rebuild or request. The fresh masthead date does not imply newly generated stories.

Sitemap and robots handlers run dynamically. Sitemap contains published records only. Metadata origins come from a validated explicit origin or Vercel deployment host, never a request Host header. Vercel Preview builds receive `X-Robots-Tag: noindex, nofollow`, and preview robots disallows all crawling. Public production robots excludes admin, API, search, reading list and reader paths. Fiction disclosure appears in reader pages and Open Graph image/description. Robots rules are crawler guidance, not access control; preview access protection must be checked separately in the owner's plan/settings.

## Free-use boundaries

[Vercel Hobby is intended for personal, non-commercial use](https://vercel.com/docs/plans/hobby), with usage limits and possible service interruption when exhausted. This plan does not assume unlimited free hosting, account eligibility, paid overages, or permission for commercial activity. The owner must check current [limits](https://vercel.com/docs/limits) and project settings before authorizing deployment. Do not start a paid trial, upgrade, purchase a domain or enable an integration. No exact cost forecast is possible without an account and traffic review.

## Review sequence after this audit

1. Resolve the already-public repository's privacy/history findings and confirm the source/canon disclosure and rights position. This is separate from approving hosting.
2. Review the local commits, screenshots, test evidence and snapshot limitations. Explicitly approve any later push or Vercel project creation; neither happened here.
3. If hosting is approved, use the settings above and review a Preview deployment first. Check available preview access protection and indexing controls; do not assume noindex makes it private.
4. Verify all public route types, all sitemap links, fiction metadata/OG, midnight behavior, mobile/desktop appearance, forbidden writes, absent private routes and working browser-local saves. Confirm no local DB/secret file was packaged, no runtime writes occur, and the native SQLite module loads on Vercel.
5. Inspect sanitized platform logs, headers, function size/cold-start behavior and usage limits. If any check fails, stop; do not provision a persistent database or paid workaround.
6. Production promotion, public URL sharing or DNS changes require another explicit owner decision after the preview is concrete and reviewable.

## Rollback

Before any future release, retain the previous reviewed deployment and source commit. If a hosted preview is unsafe, disable/remove it through owner-authorized controls. If production has been approved later, restore the last reviewed deployment using the platform's rollback controls; otherwise disable the site. There is no persistent showcase database to migrate or restore. Correct the source, rebuild and repeat preview verification. Rotating a leaked real credential and removing history require their own coordinated response; deleting a deployment or making Git private does not erase public copies.
