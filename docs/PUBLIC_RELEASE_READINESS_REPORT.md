# Public release readiness report

Audit date: **2026-10-10**. Governing instructions: `TOMORROW_TIMES_PUBLIC_RELEASE_AUDIT_CODEX.md`, read completely. This is a local preparation/security review, not a penetration test, legal opinion, deployed-service certification or authorization to publish.

## Decision

| Area | Status | Recommendation |
| --- | --- | --- |
| GitHub visibility / privacy | **BLOCKED pending owner review** | Repository was already **PUBLIC** when checked read-only. Historical private preview addresses and Git identity metadata require an explicit disclosure/history decision. This audit did not change visibility. |
| Local release preparation | **PASS** | Minimal showcase restrictions, docs, real screenshots and local tests completed; changes await owner review. |
| Vercel technical compatibility | **PASS locally / NEEDS REVIEW hosted** | Both production builds and showcase smoke tests pass. Ready for an owner-authorized preview attempt after review; hosted native binary, packaging and platform settings remain unverified. |
| Original-project licensing | **NEEDS REVIEW** | Rights reserved, no source license granted, owner-neutral attribution. Owner must confirm rights holder/contributor/AI-assisted material and source disclosure. |
| Dependencies / assets | **NEEDS REVIEW** | Zero production advisories; five dev-only high findings in one chain. Original media provenance inspected; third-party notice obligations remain. |

**Do not recommend a new public release or showcase promotion yet.** The private-repository assumption in the prompt is inconsistent with the observed remote state. A read-only `gh repo view` returned `PUBLIC`; port metadata showed port 3000 and the other existing forwarded ports remain private. No setting was changed. The package-level `private: true` flag prevents npm publication; it does not control GitHub visibility. The owner should decide promptly whether the existing public visibility is intended. Any later visibility change or history rewrite is a separate owner action; making a repository private does not recall copies already taken.

## Inspection scope and evidence

Baseline: `a5d4d5d46eb4a1f84f7a5cba69eb3c4824b54192`, on `main`, matching local `origin/main`. At intake, only the supplied release-audit prompt was untracked. All six locally reachable commits were scanned, from `2452be2` through `a5d4d5d`: **200 unique historical blobs, 112 historical paths, 1,531,483 aggregate blob bytes**. The checkout is not shallow. Largest historical blob: lockfile, 269,267 bytes. No historical binary blob, database, backup, log, `.env` secret file, private-key file or oversized generated asset was found. `src/data` contains intentional TypeScript fiction fixtures, not a private runtime database.

The first scan used local Python/Git object inspection. The committed `npm run audit:repository` repeats value-redacted inspection using local Git only: every reachable blob, commit/tag text, and current tracked/nonignored file. It reports category, path, line and object ID, never matched values. The final pre-commit current-tree scan covers **129 tracked/nonignored files**, including three reviewed WebP screenshots and the changes in this release. No oversized or sensitive-path file was found. The only current non-metadata pattern match is an intentional credential-URL rejection fixture on the reserved `.invalid` domain. Output is ignored at `artifacts/release-audit/repository-scan.json`. It deliberately exits nonzero for review findings, including ordinary commit email metadata and synthetic credential-URL rejection tests. No source or credential was sent to an external scanner.

Manual inspection covered public routes, both API handlers, admin UI/services, auth/origin/session/rate logic, database schemas/migrations, public projections, generation/provider seams, calendar, seed data, image manifests/SVGs, scripts, tests, README and operational docs. No tracked GitHub Actions or devcontainer config exists; the local `.devcontainer` directory is empty. No committed cloud config or deployment project was present. `.env.local` was absent at audit intake. Existing local databases, backups and generated artifacts are ignored and remain local; no reader data was copied into the showcase.

Limits: this does not fetch or certify every remote PR/ref, issue, release attachment, GitHub cache/fork, deleted/unreachable object, account secret or filesystem outside the project. Pattern matching cannot prove the absence of encoded/custom-format secrets or all personal information. Commit identities and all project documentation still require owner review. The original implementation prompts include workflow details and the source includes future fictional canon; public source readers can see them.

## Findings and disposition

| ID | Finding (values intentionally omitted) | Disposition |
| --- | --- | --- |
| PRIV-01 | Repository already public, contrary to the preparation assumption | **Owner blocker.** No visibility mutation. Decide whether exposure is intended before further sharing or hosting. |
| HIST-01 | Private Codespaces preview hostname in `docs/VERIFICATION.md:68`, blob `4cbc076d5b46`, introduced by `790a0f1`; same class in `docs/V2_VISUAL_OVERHAUL_REPORT.md:91`, blob `475724778b2a`, introduced by `a5d4d5d` | Replaced with generic placeholders at HEAD. **Still present in reachable history.** Hostnames are not credentials and the port is private, but publishing internal workspace identifiers needs owner approval. Do not claim history is sanitized. |
| HIST-02 | Two distinct commit identities; one GitHub noreply identity and one non-noreply identity in initial commit `2452be2`, plus author/committer display names | **Owner review required.** Values are not reproduced. Review locally with Git's author/committer view, decide whether those identities may remain public, and use the desired noreply identity for future work. No history/identity config was rewritten. |
| HIST-03 | Initial broad scan matched `ADMIN_TOKEN` assignments in historical `playwright.config.ts` | **False positive.** Both inspected versions reference `process.env.E2E_ADMIN_TOKEN`; each generates it with `randomBytes(32)`. No fixed test credential or production token was identified. |
| SOURCE-01 | Private character facts, planned resolutions and unapproved celebrity templates are intentionally tracked in source/docs | **Disclosure choice.** App routes/client bundles exclude these, but a public Git repository cannot conceal them. Keep canon intact; owner must accept source spoilers or authorize a separate publication strategy. |
| DEP-01 | Five high advisories via Next ESLint → fast-glob → micromatch → braces, GHSA-vfj7-8cjw-p6xm | Development tools only; production audit zero. No compatible fix offered by npm except an unrelated major downgrade of the Next lint stack. Not applied. Owner review; reassess before building untrusted branches/globs. |
| HOST-01 | Previous first-request path created/migrated writable SQLite and WAL files | Fixed for opt-in showcase: build-only sanitized snapshot, read-only connection, no fallback, Vercel mode guard and explicit tracing. Normal local editor behavior preserved. |
| HTTP-01 | Production CSP included development eval and unrestricted WebSocket schemes | Removed in production; retained only for local development. Inline scripts/styles remain permitted; not a nonce-based strict CSP. Image optimizer disabled for the all-local-SVG corpus. |
| INPUT-01 | Fractional comment-page numbers reached SQLite OFFSET as a fraction and could trigger an error | Clamped to integer before query. Browser regression covers fractional, negative, nonnumeric, infinite and SQL-like input. |
| META-01 | Default metadata origin could remain localhost in hosting | Validated origin and provider-host fallback; credential/path/query/fragment rejected. Provider previews get noindex header and disallow-all robots. |
| LEGAL-01 | No explicit original-project rights notice | Added owner-neutral `COPYRIGHT.md`, README notice and `UNLICENSED` package metadata. No open-source license added. Third-party terms remain separate. |

If the owner discovers any real reused credential while reviewing history or external refs: revoke/rotate it first, assess usage, then coordinate a history cleanup with all collaborators and GitHub as needed. A deletion commit cannot revoke credentials or erase historical exposure. No credential rotation, shared-history rewrite or remote cleanup was performed automatically. For the findings actually observed, no live credential has been established; the outstanding issue is consent to metadata/hostname/source disclosure, not a claim of account compromise.

## Route and application security

- All admin actions deny access in production, showcase mode and provider context even if development flags/tokens are set. The denial occurs before request parsing, cookies or database access. Unsupported mutation methods return 405. Valid local development requires explicit enablement, a strong generated token, exact Origin, a signed eight-hour HttpOnly/SameSite cookie, input validation and durable local rate limits.
- Public community POST always returns 403; other mutation methods are unsupported. No trusted identity adapter, public signup, upload endpoint, webhook, Server Action or automatic publication job is connected. Internal reader/moderator services remain tested and inaccessible through anonymous write APIs.
- Public SQL uses bound parameters; sort/table names come from fixed code allowlists. Search treats query text literally. React escapes content. No HTML injection API, arbitrary URL fetch, shell execution from request input, external redirect or remote image source is used. Framework image optimization is disabled.
- Public entity/storyline/event projections allow only reader fields; articles require published status (retractions have an explicit reader view). Private arcs do not appear in public search, sitemap, pages or client JS. The showcase target never receives private canon columns/documents or local reader/editor records.
- Security headers set nosniff, frame denial, restrictive device permissions and referrer policy. Browser tests verify production CSP behavior. Production error UI is generic; detailed editor error messages remain behind the local development gate. No CORS wildcard is enabled. Invalid metadata-origin errors deliberately omit the raw configuration value.
- Rate limits are single-database local controls, not distributed public anti-abuse protection. The fixed read-only site can still exhaust hosting quotas under traffic. No public posting/production-auth readiness claim is made.

## Dependency and licensing audit

The offline npm audit returned zero from cached/no-network evidence; that result was **not** treated as current clearance. An online audit then contacted only npm's public advisory endpoint with dependency metadata, not source or secrets. Full audit: **five high, zero critical**, all in the development lint chain. Production-only audit: **zero total**. The same chain was documented previously; no `audit fix --force` downgrade or new dependency was installed. Advisory: [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm).

All lockfile package entries have license metadata; originals retain rights-reserved status and dependencies retain their licenses. Direct dependency licenses and transitive LGPL/MPL/CC-BY considerations are in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). No unlicensed stock media, external font download, borrowed portrait, API image or third-party media file was identified in the tracked history. Twelve SVGs and the logo are repository-authored; screenshots show actual fictional public app content. This establishes recorded provenance, not legal ownership or copyrightability of every AI-assisted element. The exact rights holder was not assumed.

Public GitHub viewing/forking permissions remain applicable without an open-source license. The owner cannot technically prevent copying by adding a notice. [GitHub's licensing guidance](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository) supports that distinction.

## Verification record

Measured on Node 24.21.0 / npm 11.19.0 in the existing Codespace. Logs and bulk screenshots remain under ignored artifacts or temporary local paths; no secret values are recorded in this report.

| Check | Result |
| --- | --- |
| Typecheck | PASS — Next route generation and TypeScript |
| Lint | PASS — no errors or warnings |
| Unit/integration | **63/63 passed**, six files; final measured run 5.30 seconds |
| Normal production build | PASS |
| Normal production browser suite | 10/10 passed, 24.2 seconds |
| Editor browser suite | **1/1 passed**, 52.3 seconds; isolated authentication, CSRF rejection, review, editing, publication and sign-out |
| Showcase production build | PASS — `npm run build:showcase`; snapshot **344,064 bytes**, mode 0444 |
| Showcase trace/client isolation checks | PASS — **23 route traces**, **276 traced files / 42,294,828 bytes**, native binary present; **42 client JS files** checked; no private runtime file or private client canon match |
| Showcase browser suite | **13/13 passed**, 28.6 seconds; Vercel-like environment, unusable writable-DB path, all 135 sitemap routes return 200, all 15 admin actions denied, snapshot unchanged |
| Responsive checks / screenshots | **56/56 passed**, clean runner exit; eight routes at 360, 390, 430, 768, 1024, 1440 and 1920px; no overflow, broken images or browser page errors. Three visually inspected README WebPs total **209,970 bytes** |
| Local canonical DB integrity | `ok`, zero FK errors; **40 articles, 17 published events, 3 proposed events, 40 official threads, 0 reader comments**; permanent date range **3026-10-05–3026-10-09** |
| Git history / current source scan | Historical findings require owner review; not a clean clearance |

All test servers/databases are isolated from the working canon. The original `src/data` fixtures, presentation content and V2 stylesheet are unchanged by this audit. Snapshot tests compare all 40 projected articles, all public entities/storylines/events and standings against the original source seed, and check that private/future notes and reader/editor state are absent. They also verify deterministic output, missing/invalid snapshot rejection, read-only enforcement even after disabling the connection query-only pragma, Vercel mode guards and preview robots/headers. Browser regressions cover midnight rollover, server no-store headers, SQL/XSS-like input, missing private routes, all API actions/methods and local preferences.

The editor suite initially encountered Next's single-development-server lock; the private preview was temporarily stopped for that test and restored afterwards. An initial environment-loader named import was corrected to the package's CJS-compatible default import. Snapshot tests distinguish unpublished private notes from motivation text intentionally present in the existing public biographies. The first responsive runner recorded all 56 checks but exited with a termination status; a sequential repeat completed with exit 0 and all 56 checks passing. These local fixes did not change canonical stories or dates.

## Owner checklist and stop point

1. Review the already-public visibility, historical preview addresses, Git author/committer identities and intentional source spoilers. Decide whether to accept them or authorize remediation. If history cleanup is desired, coordinate it before any further release; do not rely on the HEAD-only replacements.
2. Confirm the exact copyright holder and contributor/AI-assisted material rights, and acknowledge normal GitHub viewing/forking permissions. Review dependency notices and the dev-only advisory chain.
3. Review the local changes, genuine screenshots and exact test evidence. No claim of production editorial authentication, open public posting, fresh daily stories or approved portraits should appear in public presentation.
4. Confirm the proposed personal/non-commercial use is eligible for Vercel Hobby and review current limits. The [showcase plan](VERCEL_SHOWCASE_PLAN.md) lists build/runtime settings, environment names, preview checks and rollback.
5. Only after those decisions, separately authorize any push, Vercel project/preview, production promotion, metadata/visibility changes or paid usage. No such action occurred in this task.

Delivery is the local commit containing this report; obtain its exact ID with `git log -1 --oneline`. The commit has not been pushed. The normal development preview is restored on private port 3000; test servers are stopped.

Work stops at local review. No push, deployment, Vercel API/CLI call, account creation, domain/DNS change, repository visibility change, public port, paid service, production credential or shared-history rewrite was performed.
