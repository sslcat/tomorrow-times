# V2 visual and preservation audit

Audit: 2026-10-10. Governing specification: `TOMORROW_TIMES_V2_CELEBRITY_FIRST_MASTER_PROMPT.md`, read in full. Earlier V2 instructions are superseded.

## Baseline

Next 16.4 / React 19.3, server-rendered App Router, SQLite/Drizzle, 40 published opening-edition reports, 52 entities, 17 published events, eight storylines and official article discussions. Baseline: 48 tests pass. Read the installed Next layouts/pages, server/client components and Image documentation; `priority` is deprecated in favor of `preload`.

The homepage leads with politics. Only one of the main stories is entertainment. The oversized Georgia masthead, cream background, small 8–12px metadata and thin newspaper rules create a historical newspaper. Repeating six flat SVGs across forty reports weakens the individual stories. Profiles have tiny monograms; the entertainment section is an undifferentiated list. Several headlines withhold their subject or event. The Lyra feature opens with coat hooks rather than the postponement.

## Asset inventory and rights

`public/art/{mars,signal,stage,sport,habitat,cargo}.svg` are original repository editorial illustrations per the existing editorial guide, not photographs. Their reuse follows a six-value enum, including habitat art for unrelated places. `public/favicon.svg` is original source. No licensed photography, approved face reference, external font, image-generation bridge or approved generator budget is present. Retain original assets for compatibility; add a small original SVG collection with separate article assignments and honest labels. Never infer a face, wardrobe, home architecture or relationship from an illustrative fallback.

## Preservation risks

- `.gitignore` used unanchored `data/`, accidentally excluding **both canonical source files** under `src/data`. Anchor only the runtime directory and commit the existing sources without changing canon.
- Preserve all IDs, URLs, section classifications, archival dates, event facts, fixtures, publication statuses and official discussion IDs. No resetting or reseeding a populated database.
- Presentation changes must not override later editor corrections or retractions. Apply only to exact opening-edition documents; expose revision provenance and the original text. Search, archives, metadata, bookmarks and official thread headings must agree.
- Existing public projections exclude private facts, future developments and resolution criteria. New timeline/profile modules must use those projections and published events only.
- Only two entertainment events exist, shared by Lyra, Teo and Mara. Five published articles concern that story across entertainment/business/culture/interplanetary desks. Do not invent a breakup, new performance, mansion or celebrity scandal. Propose three continuations using the existing event validator and approval states; keep them private pending review.
- Preserve the +1,000 calendar-year clock, Chicago editorial zone, February-29 clamp and fixed October 5–9, 3026 archive. Do not label archived stories as live breaking news.
- Community starts with actual zero participants. Preserve read-only API, trusted-session requirement, moderation, reports and source visibility checks. Admin must remain disabled in production.
- Keep local bookmarks, follows, copy-link, reading progress, light/dark reading, forms, empty states and keyboard navigation.

## Verification plan

Use local Chromium to inspect actual rendered homepage, entertainment, article, profile, universe/storyline, community and admin at 360, 390, 430, 768, 1024, 1440 and 1920 CSS pixels, plus existing 320px regression. Capture selected images under ignored `artifacts/v2-visual-review/`. Check both themes, contrast pairs, reduced motion, navigation, overflow, loaded artwork and keyboard focus. Run typecheck, lint, unit/integration tests, production build, public-route crawl and isolated editor browser workflow. Preserve a working private Codespaces port 3000 preview. No push, deployment or paid service.
