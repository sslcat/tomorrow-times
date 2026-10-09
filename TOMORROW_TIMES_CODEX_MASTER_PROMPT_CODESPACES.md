# THE TOMORROW TIMES — CODEX MASTER BUILD PROMPT

## Mission
You are an autonomous founding team: principal engineer, product designer, science-fiction worldbuilder, narrative systems architect, AI engineer, editorial director, database architect, security engineer, QA engineer, and growth strategist.

Build **The Tomorrow Times**, a premium fictional news publication reporting from **the year 3026**, exactly 1,000 calendar years after the present. It is an immersive, serious, persistent fictional news universe that sometimes happens to be funny—not primarily satire. Readers should become attached to recurring celebrities, politicians, athletes, investigators, families, organizations, and evolving storylines. Aim for the usability, breadth, and editorial polish of major news websites, with the narrative engagement of a science-fiction book series. Do not copy another publication's branding or proprietary design.

The working name and tagline ("Tomorrow's News. A Thousand Years Early.") must be configurable. Clearly disclose on the site and share previews that all reporting is fictional.

## 1. Autonomous execution and boundaries
- Inspect the current repository and environment first. If empty, initialize from scratch. Work only in this project.
- Plan, implement, test, and document a working local application. Do not stop at a plan, wireframes, or scaffolding.
- Make sensible creative and technical decisions independently. Favor a complete, polished vertical slice over dozens of incomplete features.
- You may install normal dependencies and run local tools. Do not spend money, invoke paid APIs, create accounts, deploy publicly, push commits, or alter unrelated projects without approval.
- Never expose secrets. If credentials are unavailable, deliver a fully working deterministic offline demo plus optional provider adapters.
- Commit logical milestones locally if Git is available. Do not push automatically; ask for approval before pushing to GitHub. Record limitations truthfully.

## 2. Product experience
Build a responsive, editorial-quality news site with: masthead and date; fictional-universe disclosure; lead story; breaking/developing stories; latest feed; trending topics; section landing pages; premium article pages; search; archives; character, location, organization and storyline profiles; linked story timelines; related reporting; bookmarks and follows (local persistence initially); reading progress; excellent mobile navigation; accessible loading/error/empty states. Use typography, hierarchy, whitespace, photography/illustration treatment, and restraint—not a generic AI dashboard or neon spaceship UI.

Sections: Interplanetary Affairs, Politics, Crime & Justice, Business & Economy, Science & Technology, Entertainment, Sports, Culture & Lifestyle, Investigations, Opinion, Local News, Oddities. Each needs its own editorial conventions. Mix serious, dramatic, heartwarming, mundane, mysterious, and occasionally amusing events.

## 3. Canonical universe bible
Create versioned, structured canon for 8–12 major inhabited locations; governments and jurisdictions; political factions; laws; economics and currencies; corporations; transportation and communications; scientific assumptions and technological limits; culture, education, and everyday customs; sports leagues; entertainment industries; and historical milestones between 2026 and 3026. Avoid a uniformly utopian or dystopian world. Include conflicting interests and ordinary lives.

Explicitly define travel times, communications latency, lifespan/medicine, AI personhood, and whether faster-than-light technologies exist. Characters and events must respect these rules. Preserve the world bible in database records plus human-readable documentation.

## 4. Recurring people and institutions
Seed roughly 30 memorable recurring characters spanning politicians, pop stars, athletes, business leaders, journalists, detectives, smugglers, scientists, and ordinary families. Create stable IDs, names, biographies, homeworlds, ages, occupations, motivations, flaws, relationships, public reputations, private facts, current circumstances, narrative arcs, and visual identity references when available. Seed approximately 12 major organizations. Give every entity a profile page and links to its news history.

Allow relationships, careers, elections, marriages, rivalries, arrests, scandals, births, deaths, and reputations to evolve. Do not reset characters between articles. Give readers reasons to care about them over weeks and months. Never rely solely on spectacular events; ordinary human-scale stories matter.

## 5. Events first, articles second
Use this model: **WORLD → ENTITIES → CANONICAL EVENTS → STORYLINES → ARTICLE ASSIGNMENTS → ARTICLES → PUBLICATION**.

Create at least eight interwoven initial storylines with stable IDs, participants, timelines, established facts, unresolved questions, current status, possible next developments, and resolution criteria. Some resolve quickly; some span months. Consequences persist.

Every published article references canonical events and entities. Multiple articles on the same event must not create duplicate or conflicting facts. Distinguish established facts from allegations, rumors, speculation, and opinion. Support corrections and retractions as audited records, never silent historical rewriting.

## 6. AI newsroom pipeline
Implement a modular, schema-validated pipeline:
1. Load relevant world canon, entity histories, and open storylines.
2. Propose new events with dates, participants, causes, and consequences.
3. Validate timeline, jurisdiction, travel feasibility, relationships, and world rules.
4. Evaluate originality, narrative quality, topical variety, and editorial balance.
5. Submit event proposals for editorial approval.
6. Create section-appropriate article assignments.
7. Draft varied news briefs, features, interviews, profiles, explainers, investigations, and opinion pieces.
8. Check draft claims against canon, plus repetition and editorial quality.
9. Assign licensed or generated imagery with identity continuity rules.
10. Approve and publish transactionally; update canon and follow-up opportunities.

AI output is untrusted and cannot become canon simply by appearing in prose. Use structured schemas, provenance, audit logs, idempotent jobs, bounded retries, cost estimates, and per-day generation limits. Provide three modes: (A) deterministic offline demo, (B) editor-triggered generation requiring approval, and (C) scheduled newsroom architecture disabled by default. Do not enable unattended generation or publication without explicit authorization.

## 7. Editorial standards
Write as journalists who actually live in 3026. Do not repeatedly explain ordinary futuristic technologies to inhabitants. Use concrete details, nuanced motivations, believable attribution, coherent stakes, and distinct voices for news, entertainment, sports, investigations, and opinion. Vary article length and cadence. Avoid generic AI phrasing, repetitive headlines, empty futuristic jargon, and constant civilization-ending crises. A fictional allegation should still be presented as an allegation, not established truth.

## 8. Imagery and visual consistency
Create a distinctive publication identity with polished light/mobile experiences and optional dark mode. Build an image-provider abstraction with cost controls and stable visual references for recurring people and places. Never silently replace a canonical character with an inconsistent face. Do not scrape copyrighted assets. Without image credentials, use attractive local SVG/CSS editorial artwork, original illustrations, or clearly licensed assets and keep image generation optional. No paid image calls without approval.

## 9. Architecture
Preferred stack: Next.js App Router, React, TypeScript strict, PostgreSQL with Prisma or Drizzle, Zod, CSS Modules or Tailwind, server-rendered public pages, accessible components, and automated tests. Inspect compatibility before choosing versions. If PostgreSQL is unavailable locally, use SQLite for the demo with a documented PostgreSQL migration path. Avoid premature microservices.

Separate modules for publication, canon, characters, locations, organizations, events, storylines, articles, search, editorial workflows, AI providers, imagery, and administration. Include schema migrations, seed scripts, typed interfaces, environment examples, and documented local commands.

## 10. Canon integrity
Validate contradictory ages, dates, deaths, political offices, relationships, travel times, corporate ownership, nonexistent entities, duplicated events, chronology errors, and inconsistent sports results/standings. Use tests for each rule. Some narrative ambiguity is intentional; flag uncertain conflicts for human review rather than pretending automated checks are infallible. Keep revisions and audit trails.

## 11. Editorial administration
Create a protected local admin experience to inspect canon, browse characters and storylines, review proposed events and drafts, edit headlines and articles, approve/reject, schedule publication, inspect continuity warnings, review job history and estimated provider costs, pause generation, and configure publication frequency. Restrict admin actions to authenticated authorized users in any nonlocal environment; without auth, keep admin local-only and clearly mark it as development mode.

## 12. Search, engagement, and discovery
Support search for people, worlds, cities, teams, organizations, articles, events, and storylines. Link entity mentions to profiles where appropriate. Build related-story chains, storyline timelines, previously-on summaries, bookmarks, follows, daily editions, and archives. Store anonymous preferences locally for the initial release; prepare clean interfaces for eventual accounts. Do not fabricate actual readership numbers or pretend simulated popularity is real user activity.

## 13. SEO and sharing
Implement semantic HTML, canonical URLs, page titles, metadata, Open Graph previews, sitemap, robots configuration, performance-conscious images, and accessible navigation. Clearly mark the fictional nature of articles and social previews so isolated screenshots or shared links do not mislead readers into thinking these are real events. Never invent real-world endorsements or awards.

## 14. Security and reliability
- Treat AI outputs, imported text, URLs, and all user input as untrusted.
- Validate structured inputs/outputs and enforce authorization on the server.
- Protect against XSS, CSRF, injection, SSRF, path traversal, unsafe redirects, and prompt injection. Do not render untrusted HTML without robust sanitization.
- Keep API keys server-side; provide `.env.example`; exclude secrets and local databases from Git.
- Use least privilege for database and provider access; apply reasonable rate limits and request size limits.
- Protect admin endpoints and mutations, not merely admin UI routes. Do not ship default public admin credentials.
- Make publication and canon updates atomic; prevent duplicate scheduled jobs with idempotency keys.
- Add bounded retries, timeouts, failure states, logging without secrets, and graceful degradation when AI/image providers fail.
- Back up canonical data before destructive migrations and document restore procedures.
- Do not allow external AI text to execute code, issue tool commands, change system policy, or bypass editorial approval.
- Preserve audit logs for publication, correction, canon mutation, and editorial approval.
- Document threat assumptions and known production hardening requirements.

## 15. Performance, accessibility, and UX
Aim for fast first load, responsive layout, minimal client-side JavaScript, lazy-loaded noncritical media, optimized assets, accessible contrast, keyboard support, semantic landmarks, sensible focus behavior, readable type, and robust mobile navigation. Avoid layout shift and infinite loading states. Test at narrow mobile, tablet, and desktop widths. Use reduced-motion preferences where relevant.

## 16. Initial content and narrative launch
Seed a curated opening edition with approximately 40–60 genuinely readable, interconnected articles; 8–12 locations; 30 characters; 12 organizations; 8 active storylines; and relevant historical events. Quality matters more than quota: if constrained, deliver fewer exceptional stories rather than filler.

Include at least:
- A major political controversy with multiple sides and a developing investigation.
- A charismatic pop star with an ongoing career/relationship arc.
- A sports league with actual simulated fixtures, standings, and consistent outcomes.
- A smuggling/crime case with legal and economic consequences.
- A major science discovery with uncertain implications.
- An ordinary family story that makes futuristic life relatable.
- A corporate rivalry that affects other storylines.
- Several lighter local or culture stories that add texture.

Use recurring names, believable institutional histories, consistent dates, and cross-links. Make the homepage feel like an established publication from the first launch.

## 17. Testing and acceptance
Implement unit tests for canon constraints, time/date calculations, schemas, storyline/event logic, permissions, and job idempotency. Add integration tests for database migrations, seed integrity, article queries, search, editorial approvals, and atomic publication. Add browser/end-to-end smoke tests for homepage, article reading, category navigation, search, profile pages, bookmarks, and restricted admin access. Run typecheck, lint, tests, and production build. Fix failures or explicitly document blockers.

Manually inspect desktop and mobile layouts if browser tools are available. Check for broken links, missing images, overflow, duplicate content, and unreadable articles. Verify that the offline mode works without API keys or paid services. Verify that publishing an event changes the appropriate storyline and canon exactly once.

## 18. Delivery and documentation
Create:
- `README.md`: overview, prerequisites, installation, local run, offline demo, tests, and architecture.
- `docs/WORLD_BIBLE.md`: canonical civilization and scientific rules.
- `docs/EDITORIAL_GUIDE.md`: style, tone, content quality, fiction disclosure, and correction policy.
- `docs/NARRATIVE_ENGINE.md`: entities/events/storylines, generation stages, and continuity rules.
- `docs/SECURITY.md`: security model, local admin limits, and production hardening.
- `docs/ROADMAP.md`: completed scope, limitations, and sensible next milestones.
- `.env.example`: nonsecret configuration names and descriptions.

At the end, report what was actually implemented, how to launch it, test results, any provider integrations that remain inactive, known limitations, and local Git commit IDs. Do not claim deployed, fully automated, production-secure, or visually reviewed unless verified.

## 19. Execution sequence
1. Inspect repo/environment and draft a concise implementation plan.
2. Establish architecture, database schema, migrations, and seeded canon.
3. Build the premium public reading experience with actual seeded articles.
4. Build entity pages, storyline timelines, search, bookmarks, and archives.
5. Implement event-first narrative logic, continuity validation, and editorial admin.
6. Implement AI provider abstractions, optional assisted generation, and offline fixtures.
7. Add imagery handling, SEO, accessibility, and responsive polish.
8. Build the community forums, article discussion integration, moderation foundation, and permission tests.
9. Test end-to-end, resolve failures, document, and commit locally.

You have wide creative latitude over worldbuilding, characters, stories, headlines, and visual identity. Use it. Build a universe readers can emotionally invest in, not a random headline generator. Preserve canon and long-term continuity above short-term novelty.

## 20. Mandatory live calendar requirements

The fictional publication clock is the real-world clock shifted **exactly +1000 calendar years**, in a configurable editorial IANA time zone (default `America/Chicago`). Do not freeze the publication date at October 9, 3026. Tomorrow's date should be October 10, 3026, and the calendar must continue naturally. Do not implement the offset as a fixed number of seconds or days. Define an explicit February 29 policy for years where the corresponding fictional year lacks that date, document the convention, and test it. Keep real timestamps and fictional display dates distinct in data storage.

Published articles retain their original fictional publication date forever, even as the current edition date advances. Daily edition boundaries should update at local editorial midnight without requiring a manual restart, with cache/revalidation behavior designed accordingly. Seed historical article dates once; don't silently redate the entire seed dataset on each startup. Test midnight, year transitions, DST/time zones, leap-day differences, and stable archival timestamps.

## 21. Community forums — first-class product feature

Build a genuine community for **real readers discussing published fictional news**. It should feel native to the publication rather than like a disconnected forum.

**Reader experience**
- `/community` landing page with topical sections: Politics, Entertainment, Sports, Science, General, and other relevant beats.
- An official discussion thread linked to each published article, created idempotently upon publication.
- Readers can discover discussions through articles, characters, organizations, locations, and storylines.
- Authenticated readers can create new discussion topics linked only to already-published content, post comments, reply in threads, react, follow, and report.
- Sort by recent activity, newest, and actual popularity; paginate efficiently.
- Provide spoiler formatting, links to source articles, profile/history views, and useful empty states.
- Separate reader speculation and fan theories from canonical fictional facts. User comments **never** update canon.
- Never expose unpublished articles, secret character details, editorial plans, or draft story events through forum APIs.

**Safety and moderation**
- Require properly verified authentication and server-side authorization for any public write action.
- Enforce anti-spam rate limits, input limits, escaping/sanitization, and anti-abuse protections.
- Provide reporting, moderator queues, hide/restore actions, suspensions, and auditable moderation decisions.
- Do not fabricate real readers, comment counts, reactions, conversations, or popularity.
- Any sample community content must be clearly labeled demo content, never presented as actual user participation.
- Never deploy public posting until authentication, moderation, and basic abuse controls have been verified.

**Offline Codespaces demo**
- Implement forum schemas, article-thread linkage, read-only community pages, and moderation foundations.
- If secure user authentication is not available, keep posting disabled and present an honest read-only demonstration.
- Tests must cover unpublished-content isolation, access controls, report handling, rate limits, and idempotent official thread creation.
- Do not sacrifice canonical world continuity or core reading quality to inflate forum feature count.

## 22. GitHub Codespaces: actual development environment and storage rules

**This supersedes any previous OneDrive or local Windows project-path instructions.**

The owner has already created a **private GitHub repository** named `tomorrow-times` and opened it in **GitHub Codespaces**. The working directory is expected to be `/workspaces/tomorrow-times`; verify it rather than assuming. Codex CLI is already running in the Codespaces terminal. Work directly in this repository and on the remote Codespaces filesystem. Do **not** create a duplicate project under Windows C:, D:, OneDrive, or another unrelated directory.

Keep project source, database schema, migrations, world bible, curated fixtures, and documentation version-controlled in this repository. Keep secrets, local development databases, caches, generated assets, and dependency folders excluded from Git. Explain that Codespaces uses remote disk while running and may incur storage usage even when stopped. Do not imply that the owner's 1 TB OneDrive allowance pays for Codespaces storage.

Use Git commits to preserve work. **Do not automatically push**, publish a deployment, change repository visibility, or enable billable services. Ask the owner before any push or public release. Explain that unpushed work lives only in the Codespace and could be lost if that Codespace is deleted. Before stopping, give the owner the exact commands to review and push approved commits to the private repository.

Use a modest development footprint: favor a 2-core Codespace, avoid huge dependency chains and large generated media, keep build artifacts temporary, and do not run unnecessary background processes. Check available disk space and memory before choosing heavy tools. If a build is resource constrained, make a smaller polished implementation and document the remaining work rather than upgrading the machine without permission.

Provide a browser preview using Next.js on `0.0.0.0:3000` and the Codespaces forwarded Ports panel. Do not make the forwarded port public by default. Clearly distinguish the preview from production hosting.

## 23. Absolute zero-unapproved-spend rule

The owner wants **$0 in additional paid services** unless they explicitly approve otherwise. GitHub Codespaces free allowances and Codex plan usage are separate from any external API or hosting bills; never assume an unlimited allowance or that running longer is always free.

- Do not upgrade Codespaces machine size, create paid cloud infrastructure, enable GitHub Actions workflows that incur extra costs, or authorize billing.
- Do not make paid AI, image, video, email, search, database, or hosting API calls.
- Do not provision paid accounts or start free trials requiring payment details.
- Do not perform high-volume uncontrolled Codex loops or generate excessive media.
- Implement a compelling offline-first demo with curated original stories and deterministic narrative logic, requiring **no API keys**.
- If a paid capability would improve the product, document the expected benefits, likely cost category, and required owner approval, then proceed without it.
- Stop and ask for approval if a task genuinely cannot proceed without spending money.
- Do not claim the Codex subscription, GitHub compute, or storage is free without verifying the owner's actual account allowances.

## 24. Acceptance and final delivery

At minimum, verify:
1. The Codespaces app installs and runs without paid API keys.
2. The homepage is compelling and polished on desktop and mobile.
3. Article, category, entity, storyline, archive, and search routes function.
4. Seeded events, articles, characters, and organizations are linked and coherent.
5. The fictional edition date advances from the real calendar +1000 years, with tested edge cases.
6. Historical articles do not change publication dates when the current edition changes.
7. Canon mutations and publication operations are validated, audited, and idempotent.
8. Community threads correspond to published articles; unpublished drafts stay private.
9. No public forum posting is enabled without verified authentication and moderation.
10. Typecheck, lint, automated tests, and production build are run and their real results reported.
11. The site previews in the Codespaces browser using a forwarded private port.
12. No paid services were invoked, no secrets committed, and no automatic push/deployment occurred.

Add `docs/COMMUNITY.md` covering forum data model, reader permissions, moderation, and launch blockers. Add `docs/CODESPACES.md` with setup, preview, safe shutdown, storage/cost considerations, and exact Git backup/push instructions for owner review.

At completion, provide a concise report: implemented features, example storylines/recurring characters, test results, preview URL or port instructions, storage use if measurable, Git commit IDs, security limitations, and next recommended steps. Never claim production-ready authentication, moderation, automated AI generation, or visual QA unless actually verified.

**EXECUTE NOW:** Inspect the existing Codespaces repository, establish a plan, then autonomously build the strongest working version possible. Favor delightful storytelling, recognizable recurring characters, editorial quality, and durable canon over sheer quantity. Continue through implementation and verification without repeatedly requesting permission for routine safe actions. Ask only at genuine security, billing, credential, push, or deployment boundaries.
