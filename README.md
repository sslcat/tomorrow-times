# The Tomorrow Times

A celebrity-first fictional news network from one thousand calendar years ahead. The Common Reach is a persistent science-fiction setting: decisions, relationships, match results and consequences survive between articles.

This is a working offline-first local application, with no API keys, remote database, external fonts or paid provider calls required. All reporting and illustrations are fictional.

## Run in the existing Codespace

Requires Node.js 22.13+ and npm; verified here on Node 24.21.0, a two-core Codespace. Work in `/workspaces/tomorrow-times`.

```bash
npm ci
npm run db:seed
npm run dev
```

Open **Ports → 3000 → Open in Browser**. Keep port visibility **Private**. The server binds to `0.0.0.0:3000`; this is a development preview, not a deployment. On a local machine use `http://localhost:3000`.

The first request also migrates and seeds the local SQLite database if needed. Seeding is transactional and idempotent. Historical opening-edition dates are fixed October 5–9, 3026, with distinct real timestamps. Restarting does not redate the seed. The masthead advances according to the real date plus 1,000 calendar years in `America/Chicago`, configurable with `EDITORIAL_TIME_ZONE`.

Copy `.env.example` to `.env.local` only if changing defaults. `.env.local`, local databases, backups, generated browser artifacts and dependencies are ignored by Git.

## What is here

- Forty original articles spanning all twelve editorial sections, ten inhabited locations, thirty recurring people, twelve major organizations, seventeen launch events and eight interwoven storylines.
- Responsive server-rendered front page, article pages with linked mentions and reading progress, section pages, entity profiles, event records, storyline timelines, search, daily archives and empty states.
- A cinematic V2 entertainment lead, rich Entertainment destination, People to Watch, public career timelines and Across the Reach.
- Twelve original local SVG editorial illustrations, a typed 92-entry image manifest, honest monogram/typographic fallbacks, light/dark reading, browser-local bookmarks/follows and a reading list.
- Canon-preserving presentation edits for all 40 opening headlines; original copy remains accessible, and later corrections take precedence.
- Real-calendar edition clock with an explicit leap-day policy; permanent archival dates; fictional disclosure in articles and social previews; canonical links, sitemap and robots.
- Versioned SQLite migrations and canon, Drizzle public article queries, Zod input/output contracts and an event-first editorial workflow.
- Protected development editorial desk: proposal review, assignments, draft editing, approval/rejection, manual scheduling, atomic publication, corrections/retractions, job history, generation pause/limits, private canon inspection and moderation foundations.
- Read-only community with an idempotent official thread per published article, section/sort/pagination, linked discovery and honest zero participation. The internal forum services support verified-reader topics/comments/replies, spoiler fields, reactions, follows, reports and audited moderation; **no public write/auth adapter is connected**.

Meet Amara Venn in the disputed Ares reserve vote, Lyra Saye and Teo Voss in a changing creative partnership, Tavi Okoro’s Comets in the Reach Six league, Nadi Rhee at the detained cargo vessel, Esmé Calder at Europa’s listening station, and the Daro family waiting to move.

## V2 visual and editorial overhaul

See [visual report](docs/V2_VISUAL_OVERHAUL_REPORT.md), [design system](docs/V2_DESIGN_SYSTEM.md), [headline review](docs/V2_HEADLINE_REVIEW.md), [private celebrity queue](docs/V2_EDITORIAL_QUEUE.md) and [image workflow](docs/V2_IMAGERY_WORKFLOW.md). Ten article briefs and eight character briefs are prepared; no generator is connected.

`npm run newsroom:stage-v2` backs up the local database and stages three private, continuity-checked celebrity proposals. It does not approve or publish them. Use the existing authenticated editor review workflow to advance them. `npm run test:visual` checks eight public page types at seven widths against an already running port 3000 preview and saves ignored screenshots.

## Local editorial demo

```bash
npm run admin:setup
npm run dev
```

The setup command generates a random token in ignored `.env.local` with file mode `0600`. Read `ADMIN_TOKEN` in your editor and enter it at `/admin`. Do not paste it into chat or commit it. Setup detects the private Codespaces forwarded origin where available; otherwise set `ADMIN_ORIGIN` to the exact origin in your browser, then restart development.

Click **Propose next offline event → Approve event after continuity review → Create article assignment & draft → review the text → Approve reviewed draft → Publish now if due**. The deterministic continuation adds a review agreement to Ada Daro’s meal rota. There is one curated continuation per fictional date; repeated generation on that date intentionally fails uniqueness checks rather than inventing filler. A repeated job key returns its recorded result. The default cap is three attempts per UTC day. Pause controls generation; publication always requires explicit action.

Edits reset approval. Scheduling stores a future real UTC instant and still requires an editor to publish when due. Background generation and publication are disabled. In production mode the development admin page and every admin mutation are disabled even if a token is configured. This is not production authentication.

## Checks

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm run start
```

Browser checks use Chromium headless shell. Install the free browser once, keeping its cache in `/tmp` for a modest footprint:

```bash
PLAYWRIGHT_BROWSERS_PATH=/tmp/tomorrow-browsers npx playwright install chromium --only-shell
PLAYWRIGHT_BROWSERS_PATH=/tmp/tomorrow-browsers npm run test:e2e
PLAYWRIGHT_BROWSERS_PATH=/tmp/tomorrow-browsers npm run test:e2e:admin
```

If Chromium reports missing system libraries on a fresh Ubuntu Codespace, its standard dependency command is `npx playwright install-deps chromium`. In this Codespace, the required libraries were instead downloaded and extracted into `/tmp/tomorrow-browser-libs` without changing system packages. The browser-test wrapper detects that temporary directory and the browser cache automatically. A Codespace rebuild may clear those caches.

The public suite uses a production server on loopback port 3001. The editor suite uses a separate development server on the same port, a generated ephemeral test token and a separate test database. Run suites sequentially. The public suite checks every sitemap route, reading, discovery, bookmarks, mobile/tablet layouts, artwork, private-data isolation and production access restrictions. Screenshots go to ignored `artifacts/`.

In restrictive agent sandboxes, Next’s worker processes, local listening ports and Chromium may need process/network permission. A failure to parse the TypeScript `--showConfig` output in that sandbox was resolved by allowing local build subprocesses; the normal Codespaces terminal is the intended runtime.

## Data, backup and architecture

```bash
npm run db:migrate
npm run db:seed
npm run db:backup
```

Backups use SQLite’s consistent backup API. Migrations that rebuild tables first create a local `VACUUM INTO` backup; database data is not committed. See [security and restore instructions](docs/SECURITY.md) before migration or recovery.

```text
src/app/             Next.js App Router public pages and protected server endpoints
src/components/      Reader controls, newspaper shell, article components, local editor
src/data/            Original versioned world, cast, events and opening edition
src/lib/             Calendar, contracts, DB/queries, canon validation, newsroom,
                     provider/imagery interfaces, auth and community services
db/migrations/      Versioned SQLite schema and migration history
scripts/             Seed/migrate/backup and local editor setup
tests/               Unit, database integration and Playwright browser acceptance
public/art/          Original source SVG artwork (no third-party image licensing)
```

Next.js 16 App Router, React 19, strict TypeScript, Drizzle + `better-sqlite3`, Zod, plain CSS, Vitest and Playwright. Exact versions are pinned and locked. SQLite synchronous transactions suit a single-process demo. PostgreSQL migration steps are in [NARRATIVE_ENGINE.md](docs/NARRATIVE_ENGINE.md).

## Operational boundaries

No push, deployment, paid API call, cloud resource, billing change, GitHub Action or public forwarded port is needed or enabled. Codespaces compute/storage may consume the owner’s allowance or incur charges; this application cannot verify the owner’s billing account. OneDrive storage does not pay for Codespaces. Unpushed commits exist only in this Codespace and can be lost if it is deleted.

[Codespaces preview, shutdown and exact reviewed push commands](docs/CODESPACES.md) · [World bible](docs/WORLD_BIBLE.md) · [Editorial guide](docs/EDITORIAL_GUIDE.md) · [Narrative engine](docs/NARRATIVE_ENGINE.md) · [Community](docs/COMMUNITY.md) · [Security](docs/SECURITY.md) · [Scope and roadmap](docs/ROADMAP.md) · [Verification](docs/VERIFICATION.md)
