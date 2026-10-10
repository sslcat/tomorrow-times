# Verification record

Verified in `/workspaces/tomorrow-times` on October 9, 2026, using Node 24.21.0 and the existing two-core Codespace. This report describes a local offline application, not a deployment or production security certification.

## Results

| Check | Result |
| --- | --- |
| Dependency installation | Completed from pinned npm packages; app runs without API keys |
| `npm run typecheck` | Passed, including Next route type generation |
| `npm run lint` | Passed with no lint errors or warnings |
| `npm test` | 48 unit/integration tests passed in four files |
| `npm run build` | Production build passed; public content is dynamically server rendered |
| `npm run test:e2e` | Eight Chromium public acceptance scenarios passed |
| `npm run test:e2e:admin` | One Chromium editor workflow passed, including edits and the unsaved-change publication guard |
| Public-route crawl | All 135 sitemap URLs returned HTTP 200; missing article/entity/event/thread/reader routes returned HTTP 404 |
| Database | Migrations 1–2, `integrity_check=ok`, zero foreign-key errors, idempotent seed |
| Backup | Consistent SQLite backup command completed |
| Production dependency audit | Zero production advisories at verification |
| Full dependency audit | Five development-only findings in the Next ESLint / braces chain; documented in SECURITY.md |
| Visual inspection | Desktop and mobile homepage/article screenshots inspected; tablet screenshot captured and layout checked |
| Runtime preview | Development listener on `0.0.0.0:3000` returned HTTP 200; private Codespaces port registered and visibility verified |

The seed has 40 articles, 52 entity profiles (30 people, 10 places, 12 major organizations), 17 events, eight storylines and 40 official article discussions. Community reader/comment/reaction counts start at zero.

## Meaningful test coverage

Calendar tests exercise Chicago midnight, year rollover, different IANA zones, both DST changes, valid/invalid dates, birthday age calculation and the 2000→3000 February-29 clamp. A browser test advances an open page across editorial midnight and verifies that an article retains its original date.

Canon tests exercise unknown entities and causes, ages, death chronology, jurisdiction, conflicting offices, marriage/divorce, ownership cycles, route minima, overlapping travel, FTL/light-delay violations, duplicate events and fixture results. Allegations remain review warnings. Sports standings are computed from the three canonical fixtures.

Database tests validate the complete linked seed, schema contracts, stable timestamps, safe public projections and private search exclusion. Publication tests demonstrate both exactly-once effects and full rollback after an injected failure late in the transaction. Editing invalidates approval; future schedules cannot publish early; corrections preserve dates and append audited history.

Community tests cover unverified/anonymous/suspended access, moderator roles, unpublished-source isolation, comment limits, reply ownership, report deduplication, hide/restore audits, durable rate windows, actual comment-count sorting, reaction toggling, multiple reader topics and unique official threads.

Browser tests cover article navigation and reading, category/league pages, search, profiles, bookmarks/follows across reload, storyline timelines, empty archival days, community read-only behavior and production admin/write restrictions. Viewports tested: 1440-pixel desktop, 768-pixel tablet, 390-pixel mobile and 320-pixel narrow mobile. They check overflow, images and keyboard skip navigation. The editor test signs in with an ephemeral test-only credential, proposes/approves an event, drafts and edits the article, approves, blocks unsaved publication, publishes, finds the public report/thread and signs out. Test databases are isolated from the working edition.

## Browser artifacts

The following generated screenshots are retained locally under ignored `artifacts/`:

- `home-desktop.png`
- `home-tablet.png`
- `home-mobile.png`
- `article-desktop.png`
- `article-mobile.png`

This is visual review and smoke coverage, not a formal WCAG certification, cross-browser certification, load test or external security assessment. No production public-reader identity provider is connected.

## Issues found and resolved

- Restrictive agent sandboxing initially blocked Next worker processes; local build-process permission resolved the build failure.
- Chromium lacked Ubuntu libraries. They were downloaded and extracted under `/tmp/tomorrow-browser-libs`; the test wrapper reuses them without modifying system packages.
- A root loading boundary streamed status 200 before missing content was detected. Loading UI was scoped to search, restoring real 404 responses for missing records.
- The masthead overflowed at 320 pixels. Narrow-screen typography was corrected and the browser regression passed.
- The live-clock browser test initially advanced time before hydration installed the interval; it now waits for an interactive control before advancing time.
- The editor test initially used an exact label-text lookup that included textarea text; it now selects the accessible textbox role. Actual editing and publication passed.
- Attempting a preview while the editor test server was using Next’s development cache was rejected by Next’s single-development-server guard. Development runs are sequential.
- Review found that publishing controls should disable while edits are unsaved. The safeguard and browser assertion now pass.
- The initial development database’s two visiting players were reconciled with the already-published Luna fixtures, with explicit before/after canon-correction audits. Fresh seeds already contain the correct temporary locations. No article date was changed.

Next 16 generated the repository AGENTS.md during development. Its bundled documentation was checked, and the managed guidance is committed. Generated `next-env.d.ts` is ignored as those docs require; typecheck generates types first.

## Preview, storage and operational limits

The registered private browser address is:

`https://<codespace-name>-3000.<forwarding-domain>`

The owner must be signed into GitHub with access to the Codespace. The app and browser layouts were verified locally; the owner's authenticated browser session is not available to the agent. Port metadata explicitly reports `private`, and an unauthenticated request reached GitHub’s gateway with HTTP 302. A loopback-to-self tunnel probe was inconclusive and was stopped; no claim is made that the agent completed an authenticated browser visit through GitHub's gateway. Use the Codespaces Ports panel if the private address needs reopening.

Verification processes are stopped at handoff. Run `npm run dev` to reopen the private preview. The public and editor test suites must be run sequentially and with other development servers stopped.

Measured near handoff: approximately 836 MiB for the working project including dependencies/build/test data, plus 278 MiB for temporary Chromium and 3.5 MiB for its temporary shared libraries. Temporary npm download and apt-index caches were removed. Disk had about 18 GiB available. These are filesystem measurements, not an estimate of the owner's billing allowance.

No paid model/image/email/search/database/hosting API was invoked, no account or billable infrastructure was created, and no push, deployment, repository visibility change or public port occurred. Text/image providers and scheduled publication remain inactive. Codespaces usage is separate from Codex and OneDrive; actual owner billing allowances were not verified.

The implementation milestone is local commit `00a8c0d`. The final verification/refinement commit is the HEAD containing this report; obtain exact IDs with `git log --oneline -2`. Review/push and database-backup commands are in CODESPACES.md. Unpushed commits and ignored local databases can be lost if this Codespace is deleted.
