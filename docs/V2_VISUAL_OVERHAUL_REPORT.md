# V2 celebrity-first visual and editorial overhaul

Completed locally in `/workspaces/tomorrow-times` on 2026-10-10, using the complete celebrity-first master prompt as the governing specification. Earlier V2 prompts are superseded. No Git push, deployment, paid API, generator call, account creation, repository visibility change or public port was used.

## What changed

The Tomorrow Times now opens as a compact, obsidian news network with an orbital T identity, violet entertainment accent and cinematic Lyra Saye lead. The giant serif masthead, beige default and repeating newspaper columns are replaced. Light reading remains available. Global navigation prioritizes Entertainment while preserving every section, search, saved articles, community, archives and universe discovery. The fictional disclosure and real-calendar-plus-1,000-year masthead remain visible.

The first five article slots follow Lyra’s postponed benefit, Teo’s solo recording, the unresolved credit/relationship question, Mara’s crew-pay promise and the delayed Ares relay. The Entertainment destination presents these reports as music, public lives and behind-the-scenes coverage, preserving their original desk classifications. People to Watch ranks six recurring public figures by latest published coverage, then actual report count—not invented audience popularity.

Further modules cover the cargo case, politics, science, sports, business and ordinary life. Across the Reach connects four canonical places to their latest published events, with access to the full ten-place index. Fixture-derived standings, continuing storylines and real discussion links remain intact.

Articles have immersive hero treatment, visible illustration credit and fictional disclosure, readable text, preserved author/date/actions, a published-event timeline, people/place links, source records, related reporting and the official discussion. Profiles now have distinctive identity monograms, public biographies/homeworlds, event histories, connected people and reporting. Shared events are explicitly not evidence of a private romance. Universe, organization, storyline, forum, search, archive and admin surfaces share the new visual system.

## Editorial changes and evidence

All 40 opening-edition headlines/decks and five openings were edited for immediate clarity. The first 20 homepage slots were manually reviewed in display order; the full review and source event IDs are in [V2_HEADLINE_REVIEW.md](V2_HEADLINE_REVIEW.md).

| Original | V2 presentation | Preserved boundary |
| --- | --- | --- |
| Lyra Saye is leaving the big room quiet | Lyra Saye postpones Ares benefit. The crew still gets paid. | Postponement, protected contracted wages, no replacement date. |
| Teo Voss lets the room take a verse | Teo Voss goes solo — and leaves the room noise in | Existing solo recording; no new song or guest vocalist invented. |
| A missing credit is not a confession | No guest vocal. No confirmed split. What Teo’s credits actually say. | A creative partnership is not a confirmed romance or breakup. |
| Under Europa’s ice, a rhythm. Above it, restraint. | Europa heard a repeating signal. Now comes the third-sensor test. | Independent comparison, unknown source, no claim of life. |
| Before the Daros leave, there is still supper | Ada Daro agrees to a meal rota — but keeps Thursday to herself | Existing rota and Ada’s choice, departure still delayed. |

Presentation revisions are versioned in source and apply only to exact original document fingerprints at article revision 1. Original title/deck/body remain in SQLite and can be opened on the article. Later corrections always take precedence, even if they retain the same words. IDs, URLs, dates, claims, section classifications and canonical records do not change. Search recognizes original headlines; archives, metadata, reading lists and official discussion headings use the same current presentation. Reader-authored topic titles are untouched.

## Three celebrity arcs awaiting approval

The published canon currently supports one music storyline and two music events, not three independent celebrity arcs. Three bounded original continuations are prepared and staged privately:

1. **Lyra’s small-room return:** a local listening-session announcement and no-recording request, followed by access reporting and a return to the outstanding Ares benefit.
2. **Teo’s room becomes the instrument:** an annotated explanation of the chair sound, followed by a reviewed interview/studio feature and later creative credits.
3. **Mara’s names behind the lights:** a proposed crew-credit policy, followed by cooperative/consent review, a recorded decision and its consequences.

The existing continuity validator accepts them. They are `proposed` events and private `Proposed` storylines, with draft templates ready for the existing approved-event assignment step. No new article, event effect or discussion was published. The staging command made `backups/before-v2-proposals-1791631068816.sqlite` before the additions. Public discovery excludes unpublished storylines; direct preview URLs for the proposed storyline, event and article return 404. Search and client static bundles do not contain the proposal content.

Use the protected development desk’s existing event approval → draft creation → prose review → draft approval → intentional publication sequence. [V2_EDITORIAL_QUEUE.md](V2_EDITORIAL_QUEUE.md) records the proposed facts and follow-through. Staging is idempotent and does not imply approval.

Entertainment supplies five of the first nine primary article slots (55.6%). It supplies five of the complete twenty homepage article slots (25%). This is a documented constraint of the current approved material: the page preserves meaningful wider-world coverage instead of multiplying the same music story or silently publishing new scandals. A broader celebrity ensemble, house tours, fashion, premieres and awards need new reviewed events and identity/location references.

## Imagery

Six original local SVG compositions add a violet stage, music-room concept, crew equipment, Europa sensor, sealed cargo and the canonical 4–3 cage result. The six original repository assets remain available. A typed, validated manifest covers all 40 opening articles and 52 entities, including status, rights, credit, focal point, alt text and canonical/reference metadata. Pending and missing art render labeled typography; pending portraits render distinct monograms. No fictional illustration is represented as documentary photography.

There are ten structured priority article briefs and eight recurring-character briefs in `src/editorial/image-briefs.json`. Character references and generation/review approvals remain empty. The future canon → brief → owner-authorized generation → review → approve → attach sequence is documented in [V2_IMAGERY_WORKFLOW.md](V2_IMAGERY_WORKFLOW.md). No generator MCP bridge is connected. Portrait realism and approved consistent faces remain a future limitation; local illustrations do not establish new venue or residence architecture.

## Verification results

| Check | Final result |
| --- | --- |
| `npm run typecheck` | Passed: Next route types and TypeScript |
| `npm run lint` | Passed: no errors or warnings |
| `npm test` | **58 passed**, five unit/integration files |
| `npm run build` | Passed: production webpack build and type checks |
| `npm run test:e2e` | **10 passed** in 19.9s against an isolated production database/server |
| `npm run test:e2e:admin` | **1 passed** in 54.6s; authentication, CSRF rejection, proposal/draft review, edit invalidation, unsaved-change guard, publication, public report/thread and sign-out |
| `npm run test:visual` | **56 checks passed**, no horizontal overflow, broken images or browser page errors |
| Public route crawl | All **135** indexed routes return 200; unknown/private routes return 404 |
| Reader features | Search, original-title search, bookmarks, follows, reload persistence, mobile navigation, original copy and discussion linkage passed |
| Calendar | Unit cases and browser midnight rollover passed; article dates remain fixed |
| Permissions | Production admin and public community writes return 403; unauthenticated development mutation returns 401; wrong Origin returns 403 |
| Contrast and motion | 18 primary/muted/accent text-to-surface combinations meet 4.5:1 across both themes; reduced-motion scrolling and keyboard skip focus passed |
| Canon/data | SQLite integrity `ok`, zero foreign-key errors; 40 published articles, 17 published events, eight public storylines, 40 official threads, zero comments; three separate proposed events |
| Historical dates | Still October 5–9, 3026; no reseeding or database reset |
| Git hygiene | `git diff --check` passed; canonical `src/data` files now tracked; runtime databases, backups and screenshots remain ignored |

Meaningful V2 tests cover unchanged source rows/canonical links, corrections and retractions superseding presentation, real publication-based people counts, safe missing/retracted curation, local manifest coverage, pending portraits, unconnected generation, three private validated proposal arcs, and full publication approval boundaries for each new arc in isolated test databases.

Browser tooling required free Chromium and Ubuntu libraries, downloaded/extracted into `/tmp` without system package installation. Early implementation syntax/type errors were fixed before final checks. The initial contrast assertion failed because its helper did not expand shorthand `#fff`; the corrected full suite passes. Visual capture now eagerly loads offscreen images and waits for the requested theme, avoiding misleading incomplete/light-mode screenshots. The only final browser-run warnings were the existing `NO_COLOR`/`FORCE_COLOR` environment warning, not application failures.

This is Chromium smoke, responsive and selected visual review, not a cross-browser or formal WCAG certification. No new dependency audit or external security certification is claimed.

## Visual evidence and refinements

Tested **360, 390, 430, 768, 1024, 1440 and 1920 CSS pixels**, plus the existing 320px browser regression. At every requested width the checker visits homepage, Entertainment, article, profile, universe, storyline, community and official thread. Selected desktop/mobile/tablet screenshots were opened and inspected. Both dark and light article/home layouts were inspected.

The final evidence is retained locally under ignored `artifacts/v2-visual-review/` (about 24 MiB, not committed):

- [Desktop first viewport](../artifacts/v2-visual-review/viewport-desktop.png) and [mobile first viewport](../artifacts/v2-visual-review/viewport-mobile.png).
- [1440px homepage](../artifacts/v2-visual-review/home-1440.png), [390px homepage](../artifacts/v2-visual-review/home-390.png), and [768px Entertainment](../artifacts/v2-visual-review/entertainment-768.png).
- [Desktop article](../artifacts/v2-visual-review/article-1440.png) and [light article](../artifacts/v2-visual-review/article-light-1440.png).
- [Mobile Lyra profile](../artifacts/v2-visual-review/profile-390.png) and [mobile community](../artifacts/v2-visual-review/community-390.png).
- [All 56 machine-readable results](../artifacts/v2-visual-review/checks.json).

Inspection prompted shorter, distinct typography labels so thumbnails no longer repeat or clip long headlines; a tighter desktop supporting rail to lift the celebrity lead into the first viewport; removal of missing-glyph full-width plus signs; removal of the development indicator from screenshots; and explicit light-theme capture. The final desktop lead headline starts around y=635 at 1440×900, with supporting Teo coverage visible above it in the adjacent rail.

## Preview and local commits

Private Codespaces preview: **https://humble-disco-x596q495wvvcp44v-3000.app.github.dev**. Port metadata reports `private`. The local app is verified on port 3000; the remote browser requires the owner’s authorized GitHub session. The development server is restored for handoff. If the session stops, run `npm run dev`, then open **Ports → 3000 → Open in Browser**. Do not start another development server during the isolated editor browser suite.

Local implementation milestones:

- `ad0758c` — governing prompt, visual audit, design system, and preservation of accidentally ignored existing canonical source files.
- `6cef595` — implemented redesign, editorial presentation, original imagery, private celebrity queue and tests.
- The subsequent documentation commit records this final verification report; its exact ID is returned at handoff and available with `git log -1 --oneline`.

The checked-out source, working SQLite database and private forwarded preview stay in the existing Codespace. Nothing has been pushed or deployed. Ignored local state and unpushed commits remain local; publication of the three proposals, generated imagery and any external hosting/spending still require their respective explicit approvals.
