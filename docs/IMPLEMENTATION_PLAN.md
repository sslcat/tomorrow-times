# Implementation plan

1. Next.js App Router, strict TypeScript, Drizzle with SQLite, checked-in SQL migrations, Zod contracts. No network providers or accounts required.
2. Original world: the Common Reach, ten inhabited locations, thirty recurring people, twelve institutions and eight interwoven storylines. A curated historical opening edition remains dated permanently.
3. Newspaper visual language: warm paper, ink, rust accent, local original SVG art; responsive public routes, timelines, search, reading list and follows.
4. Deterministic event-first editorial pipeline with explicit approvals, continuity validation, atomic publication, audits, idempotency and disabled scheduled automation.
5. Read-only reader community with official article threads, secure-by-default write boundaries and tested moderation foundations.
6. Unit/integration/browser checks, production build, honest operational documentation and local Git milestones. No push, deployment or paid services.

Constraints: use the existing two-core Codespace; no external image generation; private forwarded port 3000; publicly usable authentication is outside this offline release and all public write routes remain disabled.
