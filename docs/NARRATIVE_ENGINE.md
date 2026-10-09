# Narrative engine

The sequence is WORLD → ENTITIES → CANONICAL EVENTS → STORYLINES → ASSIGNMENTS → ARTICLES → PUBLICATION. Generation never creates canon just by producing prose.

## Records and provenance

`canon` stores the versioned world document. `entities` stores typed people, places and organizations, including revision numbers, relationship/office/location state and editorial-only fields. `storylines` stores established facts, unresolved public questions and private next developments/resolution criteria. `events` stores a stable identity, unique fingerprint, fictional occurrence date, causes, jurisdiction, participants, established facts, attributed allegations and typed effects. `article_events` and `article_entities` enforce referenced IDs through foreign keys. `articles` stores a schema-validated document with explicit claim provenance and separate `published_real`, `published_fiction` and real UTC `scheduled_at` columns.

`fixtures` is the only source of score-derived standings. `jobs` records idempotency keys, state, attempts, estimates and failures. `audits` preserves before/after records for editorial and canonical operations; SQLite triggers prevent application-level update/delete. `settings` stores the pause state, daily proposal cap, planned frequency and a mandatory false scheduled-enablement flag.

Migrations run transactionally with foreign-key checks. Revision 2 changes thread uniqueness so an official thread is unique per article while multiple reader topics can cite that article. A persistent database is backed up before the rebuild. Seeding uses a versioned world marker and one transaction; it never replaces existing content on startup.

## Clock contract

1. Obtain the actual instant.
2. Extract its year/month/day in the configured editorial IANA zone, default `America/Chicago`.
3. Add exactly 1,000 to the calendar year.
4. If a real February 29 lands in a nonleap fictional year, clamp to February 28. For example, 2000-02-29 → 3000-02-28. Do not roll into March.

This mapping is intentionally not a duration and is not injective in that leap-day case. A real February 28 and 29 can share a fictional edition date. Preserve the actual timestamp for ordering and auditing. Do not convert a fictional date string through the browser’s local zone; format it as a date at UTC noon.

All public content routes are dynamically server rendered, with no persistent route cache. Each request calculates the current edition; an open masthead checks every 15 seconds and on tab visibility change. The archive is keyed by immutable original article dates. A client can remain open through editorial midnight without a restart, with a maximum 15-second visible clock lag. Day changes do not trigger content generation. The seed fixes October 5–9, 3026 once; no daily background seeding occurs.

## Editorial state machine

- Offline generation loads canon context, proposes a Zod-validated event, checks continuity and creates a **proposed** record with a job/audit record. It does not change public facts.
- An editor reviews uncertainty and approves or rejects the proposal. Events with blocking issues cannot be approved.
- An approved event receives a section/format assignment and draft from the provider. Its exact claims must reference established facts from its approved events. Duplicate headlines and identical paragraphs are rejected.
- An editor checks the prose, imagery, originality, emotional/section balance and attribution before draft approval. This quality judgment is human assisted, not a pretend automated semantic evaluator. Any edit resets approval.
- An approved draft may be held until a future real timestamp. The editor still has to publish it manually when due.
- Publication revalidates the draft/events inside a SQLite transaction, applies typed entity/fixture effects, appends storyline facts, marks events published, freezes real/fictional article dates, creates the official thread and writes all audit records. Failure anywhere rolls back everything. Repeating a published article ID changes nothing.

Public event/profile/storyline/search queries use explicit safe projections and only published records. Private facts, possible next developments and resolution criteria do not enter public components or forum APIs. Reader comments cannot call canon mutation services.

## Validation and intentional limits

Tests cover ages/birth dates, recorded deaths, event identity and cause ordering, existing offices, reciprocal marriage/divorce, corporate ownership cycles, location/jurisdiction, minimum transit times, overlapping travel, nonexistent entities, FTL, conservative light-delay lower bounds and fixture identity/results. Unknown routes block approval until the route canon is extended. Allegations produce a review warning.

These are conservative structured rules, not a complete physical or legal simulator. Participant linkage may mean a person is affected or quoted remotely; it does not mean physical attendance. Explicit travel effects carry movement. There is no ephemeris, life-support engineering solver, universal natural-language claim verifier or automated quality oracle. An editor must review physical presence, detailed source attribution, unique political titles and ambiguities beyond the structured schema. Existing office transfers and result revisions deliberately fail until a dedicated audited transition is implemented; no quiet overwrite is offered.

The six-team sports table is computed from three recorded opening-round fixtures played on Luna. Three clubs have not yet played. These fixtures are curated deterministic simulated outcomes, not a randomized match simulator.

## Provider and scheduler seams

`NewsProvider` receives structured context, returns unknown/untrusted data, advertises paid status and supplies a cost estimate. `OfflineProvider` uses curated continuation logic. The `editor` mode uses the same provider but names the manual workflow. Remote/scheduled modes throw. No API keys, network fetches, executable tools or payment integrations exist in the provider.

Each operation permits at most two attempts and a five-second result deadline. Offline work has no network side effects. A future remote adapter must implement AbortSignal cancellation; Promise timeout alone does not cancel remote activity, so the current bounded helper must not be treated as a safe paid-call retry policy. Only approved budget and a reviewed adapter may add paid traffic. Jobs are claimed before work, count failed attempts toward the daily UTC cap, and retain failed/running states. A crashed running job remains inspectable and is not automatically replayed. There is no unattended scheduler process.

`ImageProvider` resolves only six enum-approved local assets at zero cost. Canonical character identity references are stable, and no face generator is active.

## PostgreSQL path

Before a production migration: back up SQLite and stop writes; define equivalent PostgreSQL tables with `jsonb`, `timestamptz` for real instants and `date` for fictional dates; preserve IDs and exact existing dates; copy data in foreign-key order; verify counts, event/article joins and fixture-derived standings; replace the Drizzle SQLite connection/schema; port synchronous transaction services to awaited PostgreSQL transactions; use unique constraints plus row locks or serializable transactions for proposal claims, quotas and publication; move rate limits to a shared store; retain append-only audit permissions on a distinct role. Test concurrent publishing, crash recovery, restore and rollbacks before switching traffic. Do not assume SQLite’s synchronous process model scales to multiple web instances.
