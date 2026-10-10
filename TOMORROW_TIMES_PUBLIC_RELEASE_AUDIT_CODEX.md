# THE TOMORROW TIMES — PUBLIC RELEASE READINESS & VERCEL AUDIT

You are Codex working in the EXISTING `/workspaces/tomorrow-times` GitHub Codespace. The owner wants to showcase this original fictional celebrity-first news universe publicly, make the GitHub repository public without licensing the code for reuse, and potentially deploy a safe public version to Vercel. This is an **audit and preparation task**, NOT authorization to publish, change visibility, create a Vercel project, spend money, or expose any private data.

## Non-negotiable boundaries
- Inspect `AGENTS.md`, Git status/history, repository contents, project docs, scripts, tests, app routes, data model, and environment handling before modifying anything.
- Preserve all canonical worldbuilding, characters, events, stories, forums, admin behavior, visual V2 design, and the real calendar +1000-year offset.
- No push, repository visibility change, external deployment, account creation, paid service, DNS changes, or production secret creation without explicit human approval.
- Do not print actual secret values, tokens, private credentials, or sensitive personal data in logs/reports. If a secret is exposed, report the location and remediation category without reproducing the secret.
- Make only safe local edits and commits; leave the repository private until the owner approves publication.
- Keep the current Codespace preview private.

## 1. Public repository security and privacy audit
Review the entire tracked repository AND reachable Git history (not only HEAD) for accidentally committed secrets, `.env` files, access tokens, credentials, private personal information, internal URLs, logs, database snapshots, user data, oversized generated artifacts, copyrighted or unlicensed media, and unsafe sample data. Inspect `.gitignore`, `.env.example`, artifacts/backups, `.devcontainer`, CI config, documentation, and any generated assets. Use safe local tools and avoid exfiltrating source or secrets to third-party scanners. Assess dependency vulnerabilities using offline tools where possible; any network-based audit must not leak secrets. If historical sensitive material is found, do not simply delete it in a new commit and claim success: flag the issue, advise credential rotation and history cleanup, and STOP the public-visibility recommendation pending owner review. Do not rewrite shared history automatically.

Audit public routes and API handlers for unauthorized writes, SSRF, injection, XSS, information leaks, insecure admin access, and leaking unpublished canon. Check server/client separation, rate limiting, request validation, auth assumptions, and community moderation. Specifically ensure no development-only administrative endpoints become writable by anonymous internet visitors. Prepare a clear release-blocker list.

## 2. Copyright and licensing choice
The owner wants a public, viewable repository but **does not currently authorize reuse, redistribution, derivative works, or commercial exploitation of the source**. Do not add MIT, Apache, GPL, Creative Commons, or any other permissive/open-source license. Add a concise accurate copyright/rights-reserved notice in README and, if useful, a plain `COPYRIGHT.md` stating that no source-code license is granted. Do not imply that public visibility technically prevents copying, or that GitHub's normal viewing/forking permissions disappear. Use an owner-neutral copyright attribution if legal ownership is uncertain; ask for the exact copyright holder before hardcoding a legal name. Do not make unsubstantiated ownership claims about third-party assets.

## 3. GitHub presentation
Improve the README to be portfolio-quality and honest. Include: memorable short pitch, prominent fiction disclosure, project screenshots from ACTUAL V2 app, feature tour, current implemented vs planned capabilities, tech stack verified from code, architecture overview, local/Codespaces setup, commands for tests and preview, image/asset provenance, community moderation status, and copyright notice. Do not fabricate usage stats, testimonials, AI automation, or production readiness. Prefer small optimized real screenshots stored under an appropriate docs folder, avoiding sensitive content and excessive repo size. Add a suggested GitHub description and topic tags in a doc; do not change remote repository settings without approval.

## 4. Vercel technical readiness
Investigate whether the existing Next.js application can run on Vercel Hobby in a **non-commercial, read-only public showcase mode** without paid services or production secrets. Audit:
- Node/Next version, build commands, output mode, dynamic routes, server actions and API handlers.
- SQLite/file-based DBs, mutable JSON files, seeded data, runtime filesystem writes, caches, and serverless filesystem constraints.
- Any features relying on a persistent Codespaces process, scheduled jobs, background workers, local disk, local-only auth, or internal ports.
- Production environment variables and safe defaults.
- Whether the site can display its seeded fictional articles and storylines read-only from immutable build artifacts without a persistent production database.
- Whether community posting, admin writes, automatic publication, image upload, and any write APIs should be explicitly disabled in public showcase mode.
- Build-time vs request-time fictional edition date and rollover at editorial midnight, archive date stability, time zones, and caching behavior.
- Public robots/sitemap/Open Graph metadata with clear fictional labeling.
- Security headers, rate limiting, error handling, performance, responsive behavior, and asset provenance.

Implement a **safe, opt-in showcase configuration** only if feasible with no paid external services. Fail closed on write routes; do not merely hide admin links while leaving APIs writable. If persistent database hosting is needed, document it as a blocker rather than provisioning it. Do not assert Vercel compatibility until a production-equivalent build and relevant smoke tests succeed. Do not call Vercel APIs or CLI to create/deploy anything.

## 5. Tests and evidence
Run typecheck, lint, unit/integration tests, production build, and browser smoke tests available in the repo. Add targeted tests for public showcase restrictions, anonymous access, secrets/configuration safety, unpublished canon isolation, calendar behavior, and representative public routes. Capture actual V2 screenshots and verify mobile/desktop layout. Report exact test results and unresolved issues.

## 6. Deliverables
- `docs/PUBLIC_RELEASE_READINESS_REPORT.md`: PASS / BLOCKED / NEEDS REVIEW, exact findings, Git-history inspection scope, privacy/secret issues (without revealing values), dependency/asset risks, and owner checklist.
- `docs/VERCEL_SHOWCASE_PLAN.md`: realistic free/non-commercial hosting plan, build configuration, read-only restrictions, filesystem/database constraints, safe environment variables (names only), expected limitations, preview/production review steps, and rollback instructions.
- Polished README with genuine screenshots and a clear **all-fictional** disclaimer.
- Copyright/rights-reserved notice without an open-source license.
- Any minimal, tested code/config changes needed for safe showcase mode, but NO deployment.
- Local commit(s), clean working tree, exact test results, and a clear recommendation whether it is safe to make the repository public and whether a Vercel deployment is technically ready.

## 7. Stop point
Stop for human review. **Do not push, deploy to Vercel, change GitHub visibility, or incur paid usage.** Summarize blockers and provide precise next steps for the owner. Do not mark it safe if important evidence is missing. Begin the audit now and work autonomously through all safe preparation steps.
