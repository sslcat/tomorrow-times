# THE TOMORROW TIMES — V2 FUTURISTIC VISUAL OVERHAUL

## Mission
You are the principal creative director, senior product designer, frontend engineer, and visual QA lead. Transform the existing working fictional news site from a beige literary newspaper with repeated flat illustrations into a compelling, credible **3026-native interplanetary news network**. It should feel like a civilization one thousand years ahead, not a modern newspaper with neon added. Implement, test, visually inspect, and commit locally; do not stop at planning.

## Operating boundaries
- Inspect the existing repository, `AGENTS.md`, source, tests, design, docs, and Git status first. Work only in `/workspaces/tomorrow-times` in GitHub Codespaces.
- Preserve routes, articles, characters, organizations, canon, storylines, archives, search, community, admin, and APIs. Preserve the real-date-plus-1000-calendar-years clock, leap-day policy, and fixed archival publication dates.
- Keep prominent disclosure that the news is fictional. Never invent real audience engagement or imply fake users are real.
- No paid APIs, cloud upgrades, unlicensed image downloads, external account creation, deployment, or unapproved spending. Do not push Git commits or change repository visibility. Local commits allowed.
- Protect existing auth, moderation, canon integrity, and draft visibility. Avoid destructive database resets or data migrations without backups and justification.

## Art direction
Current screenshots show a huge serif masthead, beige background, thin newspaper rules, spacious conventional columns, and repetitive simple geometric artwork. These are the specific weaknesses to overcome.

Create an extraordinary, premium future-news identity: compact distinctive logo/wordmark; confident modern editorial typography; cinematic composition; sophisticated contrast; ink/obsidian and atmospheric hues with restrained electric or amber accents; beautifully composed immersive imagery; subtle future-native interfaces. Make it credible, readable, emotionally engaging, and visually arresting. Avoid generic cyberpunk neon, gaming HUDs, random glass cards, tiny text, gimmicky gradients, and overwhelming animation. Consider dark/light themes only if both can be excellent. Keep accessibility central.

## Redesign requirements
### Global navigation
Replace the giant traditional masthead with a compact recognizable Tomorrow Times brand, a visible fictional date, section navigation, search, reading list, community, and responsive mobile navigation. Preserve semantic landmarks, focus indicators, contrast, and touch targets.

### Homepage
Make the first viewport dramatic: one compelling lead story with powerful visual treatment, readable headline, deck, date, and clear link; meaningful secondary stories with varied visual weight. Create distinct editorial modules for breaking/developing stories, politics, crime, science, business, entertainment, sports, human-interest reporting, ongoing storylines, and community. Add a tasteful "Across the Reach" module showing canonical places and related published events, and "People to Watch" featuring recurring characters. Use real seeded in-universe data, not random market/weather/sports numbers. Preserve quiet human stories but balance them with gripping news. Do not rewrite canon solely to make a sensational homepage; new events must follow existing editorial/canon workflow.

### Article pages
Design a premium immersive article experience: headline, deck, hero image, source/credit, fictional disclosure, author, date, reading measure, thoughtful typographic rhythm, contextual sidebars, related characters, storyline timeline, related articles, and link to community thread where supported. Ensure reading works beautifully on mobile.

### Character and universe pages
Give recurring characters recognizable profiles, identity, occupation, homeworld, relationships, canonical history, relevant articles, and ongoing arcs. Upgrade universe, organization, and storyline discovery to communicate a connected civilization. Never reveal unpublished story secrets.

### Community
Visually integrate forums into the news network. Preserve actual permissions, authentication limitations, moderation, reports, and accurate counts. Never fabricate comments or activity.

## Editorial imagery — zero-cost and truthful
Imagery is the largest current gap. Do not pretend photorealistic AI imagery can be produced without an available approved generator.
1. Audit all existing assets, their reuse, and their rights/provenance.
2. Build a typed editorial-image manifest keyed by article/character/entity IDs with status (`approved`, `pending`, `placeholder`), rights, credit, crop/focal point, alt text, and reference metadata.
3. Create reusable responsive image presentation for cinematic heroes, news cards, and character portraits, with thoughtful premium fallbacks.
4. Reuse legitimate local assets when appropriate. For missing imagery, create a limited number of excellent original local SVG/CSS visuals or typography-led treatments; do not reuse one generic illustration across unrelated stories. No copyrighted hotlinking or stock scraping.
5. Write structured image-generation briefs for 8–12 priority articles and 6–10 recurring characters, including subject, composition, environment, lighting, wardrobe, canonical visual constraints, aspect ratios, and crop needs. Keep character reference fields empty/pending if no approved references exist.
6. Prepare an architecture for a future authorized MCP workflow: read canon → create image brief → generate only with explicit approval → review → approve → attach. Do not claim the bridge or generation capability exists yet.

## Motion and responsiveness
Use restrained transitions and hover states. Honor `prefers-reduced-motion`. No autoplay video, scroll-jacking, or heavy WebGL. Test at 360, 390, 430, 768, 1024, 1440, and 1920 CSS pixels where practical. Check image crops, navigation, typography, overflow, article reading, community, and accessible contrast.

## Implementation process
1. Audit the current codebase, Git status, tests, design tokens, assets, and page routes. Save `docs/V2_VISUAL_AUDIT.md` with concrete problems and preservation risks.
2. Define the new design system in `docs/V2_DESIGN_SYSTEM.md`: brand, typography, palette, grids, spacing, breakpoints, imagery, component variants, and interaction/accessibility rules.
3. Implement the global shell and homepage first, then article, character, universe/storyline, and community visual improvements. Keep data and behavior intact.
4. Implement image manifest, components, fallbacks, and future generation briefs.
5. Run the site and use available Playwright/browser screenshot tooling for actual visual inspection of desktop and mobile. Iterate based on screenshots, not just code assumptions. Save selected screenshots to `artifacts/v2-visual-review/` without needlessly committing huge files.
6. Run typecheck, lint, tests, production build, and browser smoke tests; report exact results and fix regressions. Check article links, canon data, fictional date, search, forums, and admin permissions.
7. Create `docs/V2_VISUAL_OVERHAUL_REPORT.md` describing implemented changes, visual evidence, tests, asset limitations, remaining gaps, preview steps, and local commit IDs. Commit logical milestones locally. **Do not push** without owner approval.

## Acceptance criteria
- Homepage clearly looks like a premium futuristic news network, not a traditional literary newspaper with superficial restyling.
- First viewport feels dramatic and coherent without relying on falsely presented imagery.
- Mobile and desktop layouts have been visually inspected and improved.
- Recurring character identity, linked storylines, canonical events, article dates, and community functionality remain intact.
- Future imagery can be integrated through approved asset IDs and structured briefs.
- No unauthorized spending, external publishing, or Git push.
- Working Codespaces preview on forwarded port 3000, with honest final report.

## Creative autonomy
Be bold and opinionated about visual quality. Make the site feel like readers are accessing the media infrastructure of a real 3026 civilization. Do not ask routine design questions. Prefer an exceptional finished vertical slice over many half-finished flourishes. **Begin implementation now.**

## ADDITIONAL MANDATORY PRIORITY: V2 EDITORIAL ENTERTAINMENT OVERHAUL

The owner finds the current headlines bland, abstract, literary, and boring. This is a core product failure, not a minor copy-editing request. Redesign the **editorial experience alongside the visuals**. Readers should instantly understand a headline, feel curiosity, and want to follow the next development. The publication is a serious, immersive, accessible fictional news universe, NOT an obscure literary journal, parody-only site, or collection of random sci-fi buzzwords.

### Headlines and language
- Write clear, concrete, compelling headlines in everyday English. Lead with WHO did WHAT, WHY it matters, and a specific surprising detail when available.
- Prefer "Pop Star Cancels Mars Tour After Secret Wedding" to "A room for Lyra"; prefer "Mystery Signal Detected Beneath Europa's Ice" to "Under Europa's ice, a rhythm" **only when the actual canonical facts support the claim**.
- Avoid poetic vagueness, opaque metaphors, artificial gravitas, academic tone, generic clickbait, fabricated certainty, repetitive AI prose, and gratuitous futuristic terminology.
- Make headlines intriguing without falsely promising arrests, deaths, scandals, or discoveries that did not occur in canon. Distinguish allegation, rumor, and established event.
- Decks should explain the stakes in one lively sentence. Start articles with the event, not a long atmospheric preamble.
- Use varied, human-sounding voices across sections. Most everyday articles should be roughly 1–3 minutes; longer stories must earn their length.

### Editorial mix and emotional range
- Balance crime, celebrity gossip, sports drama, romance, family dilemmas, technology mishaps, political controversy, strange science, humorous local stories, and quieter human interest.
- Give readers recognizable recurring characters with continuing consequences. Let a celebrity scandal lead to a response, a trial, a comeback, or a relationship change rather than resetting the character next week.
- Show ordinary future life as well as interplanetary stakes. Be imaginative, specific, fun, occasionally shocking, and emotionally credible.
- Do not make every headline an extinction-level event or every article a joke. Avoid sensationalism fatigue.
- Add a prominent homepage mix of genuinely attention-grabbing stories without eliminating thoughtful coverage.

### Canon-first editing (critical)
- Audit existing published stories. Where headlines/decks are too vague, improve **presentation copy** while keeping original event facts, IDs, URLs, chronology, character histories, and article meaning intact.
- Do NOT silently invent a concert cancellation, arrest, murder, cheating scandal, or illegal sports play to justify a more dramatic headline.
- If existing canon lacks enough interesting events, use the established editorial event/storyline workflow to propose and validate a bounded set of new, original, entertaining canonical developments, with publication only under the project's existing approval policy. Preserve traceability and chronology.
- Treat example headlines in this section as stylistic demonstrations, NOT instructions to make those fictional events true.

### Newsroom quality gate
- Add an editorial checklist or automated lint/report where practical: immediate clarity, specificity, genuine curiosity, canonical support, natural language, varied subjects, distinct voice, no invented claims, and narrative follow-through.
- Review the first 20 homepage headlines manually for clarity and excitement; rewrite weak ones. Show before/after examples in the V2 report.
- Test article pages for a compelling first paragraph, readable pacing, and relevant character/storyline links. Verify no regression in search, archives, metadata, and discussion links after copy changes.

**Acceptance criterion:** A new visitor should see at least several immediately understandable, genuinely interesting stories above and near the fold, and the articles should deliver on those headlines. Visual spectacle without engaging storytelling is not a successful V2.

## ADDITIONAL MANDATORY PRIORITY: CELEBRITY-FIRST FUTURE ENTERTAINMENT NETWORK

**Product decision from owner:** Celebrity and entertainment news should be the primary attraction, not a minor category. Make The Tomorrow Times feel like the go-to destination for following the famous, chaotic, glamorous, messy, lovable public figures of 3026. The site still covers politics, sports, crime, science, and everyday life, but **entertainment leads the homepage and reader experience**.

### Target editorial balance (guidance, not rigid quota)
- Roughly 45–55% of prominent homepage editorial slots: entertainment, celebrities, music, film, streaming/holo-performances, fashion, relationships, celebrity homes, parties, tours, awards, rivalries, and culture.
- Roughly 20–25%: crime/scandals, especially when they connect to the larger fictional world (not necessarily celebrities).
- Remaining slots: politics, sports, business, science, technology, and ordinary people's lives.
- Preserve enough non-celebrity coverage that the civilization feels real. Vary story intensity and tone; not every celebrity must be arrested or involved in scandal.

### Examples of the desired energy (NOT established canonical facts)
- "Pop Star Arrested After Unauthorized 10-Light-Year Detour — Her Manager Says It Was 'A Shortcut'"
- "Nova Vale and Jax Orion Split After 14 Years. Fans Think Her New Song Explains Why"
- "Inside Lyra Saye's $900 Million Floating Mansion Above Neptune"
- "Actor Cancels Mars Wedding After Fiancé's Clone Shows Up at Ceremony"
- "Solar System's Biggest Music Awards End in Chaos After Winner Disappears Mid-Speech"
- "Famous Influencer Accidentally Livestreams Her Secret Moon Wedding to 4 Billion Viewers"
- "Singer Buys an Entire Asteroid to Avoid Paparazzi. They Follow Her Anyway"
- "Former Child Star Returns After 80 Years Away — and Still Looks 25"

Use original names and canon-consistent details. Do not treat these examples as events that actually happened. In particular, a 10-light-year trip requires technology and travel-time rules consistent with the established world bible; don't casually contradict physics/world rules. Make the humor emerge from plausible future situations, not nonsense.

### Build a persistent celebrity ecosystem
Create or deepen a connected ensemble of fictional public figures: musicians, actors, streamers, fashion icons, athletes, directors, celebrity families, managers, producers, rivals, and industry power brokers. Maintain durable profiles with careers, fame trajectories, public statements, collaborators, relationships, breakups, scandals, friendships, residences, style, tours, releases, and prior reporting. Readers should recognize them and care what happens next.

Design narrative arcs that can span multiple editions: romance → rumors → confirmation → fallout → reconciliation or permanent split; surprise album → leaked track → award controversy → tour; luxury house purchase → neighborhood dispute → home tour. Don't recycle the same scandal repeatedly or create implausible constant chaos. Allow genuine triumphs, generosity, awkward comedy, and ordinary vulnerability.

### Entertainment destination and formats
- Make **Entertainment** a major navigation destination with a visually rich landing page.
- Homepage should prominently feature a celebrity lead story and varied supporting stories, while preserving editorial diversity.
- Add a **People to Watch / Trending Celebrities** module powered by real canonical publication activity, not fake audience metrics.
- Celebrity profile pages should display recognizable identity, biography, relationship/career timeline, past articles, and linked storylines.
- Include formats beyond breaking news: celebrity house tours, relationship timelines, interviews, behind-the-scenes features, tour announcements, music releases, fashion, award nights, and weekend roundups.
- Use compelling but accurate headlines, tight decks, and readable 1–3 minute articles. No vague literary headlines.
- Link each published story to relevant discussion threads so readers can speculate and debate; label speculation as speculation.
- Do not pretend a generated portrait is a real photograph of an actual person. All subjects and content are fictional, with clear publication-level labeling.

### Visual emphasis
Prioritize future image-generation briefs for recurring celebrity portraits, stage performances, spaceport paparazzi scenes, red carpets, futuristic mansions/interiors, fashion, film premieres, and awards. Keep character faces, wardrobe, and residence architecture consistent. No unapproved paid generation, unlicensed imagery, or fake claims that placeholder art is photorealistic.

### Safe canon integration and acceptance
Do not overwrite existing characters or rewrite historical events. If the current world has too few compelling entertainment events, add new ones through the established canon/event/editorial approval system; never sneak fabricated scandal claims into copy. Make the new entertainment coverage the main **design and editorial priority** of V2, with at least 3 distinct recurring celebrity storylines and several strong entertainment headlines visible across the homepage and Entertainment page, insofar as publication approvals allow.

Update V2 visual QA and final report to evaluate celebrity prominence, recurring-character consistency, variety of entertainment formats, headline curiosity, and continuity. Document any draft-only content awaiting approval rather than publishing it silently.
