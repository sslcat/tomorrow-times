# Security model and restore

The local editor is intended for a private Codespaces forwarded port. An opt-in read-only showcase now serves immutable published fixtures without a writable hosted database. Neither mode provides production public authentication or an unattended newsroom. See [public-release findings](PUBLIC_RELEASE_READINESS_REPORT.md) and the [showcase plan](VERCEL_SHOWCASE_PLAN.md); the repository was observed already public during the release audit, while the forwarded preview remained private.

## Enforced boundaries

- Development admin is disabled by default. `admin:setup` creates a unique 256-bit random token in mode-0600 ignored `.env.local`. No default public credentials exist.
- The token signs an eight-hour HttpOnly, SameSite=Strict cookie. HTTPS origins receive Secure cookies. Constant-time comparison verifies signatures and sign-in tokens. Restarting with a rotated secret invalidates old cookies.
- Every admin mutation checks the enabled development flag, exact configured Origin, then authenticated cookie. Login is rate limited too. The page checks authentication before querying private records. In `NODE_ENV=production`, showcase mode, or Vercel context, **all development admin actions are denied**, regardless of configuration.
- `ADMIN_ORIGIN` must equal the actual browser origin. Origin validation is CSRF protection, not authentication; possession of the token is still required. Codespaces’ private port authorization is an additional outer boundary.
- Public community POST always returns 403. There is no public sign-up, session, email, OIDC or trusted client-supplied identity. Internal reader services require a verified, unsuspended DB user resolved by a future trusted server session adapter. The services are not exposed as public mutation endpoints.
- Moderation requires a moderator role and a reason; hide/restore, suspension and report resolution are audited. Real counts exclude hidden comments and unpublished/retracted source content.
- Admin JSON requests enforce a 40 KB streamed limit, Zod contracts and length bounds. SQL inputs are parameterized; sort fields and dynamic table names are selected from fixed code enums. Public search treats text literally.
- No untrusted HTML rendering, `dangerouslySetInnerHTML`, Markdown HTML parser, external fetch URL or URL-based image proxy is used. React escapes all prose/comments; spoiler content is plain text in `<details>`.
- User input cannot execute code, call providers, alter system policy, resolve local paths or bypass review. The imagery enum rejects path traversal. There are no remote redirect destinations.
- Canon publication is atomic and revalidated; identity keys prevent replay. Audits are append-only via database triggers. Runtime database files and credentials are excluded from source control.
- Headers restrict framing, content sniffing, referrers and device permissions. The CSP permits Next inline scripts/styles. Eval and WebSocket schemes are allowed only in development and removed in production. This is not a strict nonce-based production CSP. The unused image optimizer is disabled.

## Threat assumptions and remaining work

Anyone with filesystem access to this Codespace can read the local DB and secret and can edit application code. The editor token is a development capability, not a multi-user role system. Audit triggers protect normal application use, not a filesystem administrator or hostile database owner. SQLite quotas and transactions suit a single server; distributed deployments require shared atomic rate limiting, trusted proxy configuration and concurrent job locking. Data files use the user’s workspace permissions; disk encryption, retention and backups are owner responsibilities.

Before public posting: implement a vetted identity provider with verified sessions, server-side reader/moderator roles, session rotation/revocation, stronger distributed anti-abuse controls, moderation staffing and escalation, privacy/deletion/retention policies, spam handling, deployment TLS and trusted-origin configuration, nonce-based CSP and production telemetry with secret scrubbing. Verify isolation and authorization end to end before enabling the write route. Do not merely flip the current disabled route.

The release audit on 2026-10-10 reconfirmed five development-tool findings along the Next ESLint → fast-glob → micromatch → braces chain (GHSA-vfj7-8cjw-p6xm, nested-pattern stack exhaustion). `npm audit --omit=dev` reported zero production advisories. No compatible upstream fix was offered other than downgrading the Next lint configuration across major versions; that downgrade was not applied. Treat untrusted lint glob patterns as out of scope, pin dependencies, and reassess before a release. Audit results are a point-in-time observation, not a security guarantee.

## Backups and recovery

Run `npm run db:backup` before making destructive changes. It uses `better-sqlite3`’s consistent backup API, which includes committed WAL data, and writes an ignored timestamped snapshot under `backups/`. The table-rebuilding migration also calls `VACUUM INTO` before disabling foreign keys and verifies the result inside its transaction. An in-memory test database needs no disk snapshot.

To restore a known-good backup:

1. Stop the preview/editor server and any test server using that database.
2. Run a final backup if the database still opens. Preserve the current `.sqlite`, `-wal` and `-shm` together in a separate ignored recovery directory rather than overwriting them.
3. Copy the chosen backup to the configured `DATABASE_PATH` with the server stopped. Do not leave old WAL/SHM files beside the replacement.
4. Run `npm run db:migrate`, then check `PRAGMA integrity_check` and `PRAGMA foreign_key_check`, article/event counts, original timestamps and the audit history before reopening the preview.
5. If a migration fails, its transaction rolls back. Keep the snapshot and investigate before retrying; never delete canonical records to make a migration pass.

Example with the default database (replace the sample backup filename):

```bash
mkdir -p data/recovery-before-restore
mv data/tomorrow-times.sqlite* data/recovery-before-restore/
cp backups/CHOSEN-BACKUP.sqlite data/tomorrow-times.sqlite
npm run db:migrate
```

This is an intentional owner-operated recovery operation. The application never runs it automatically. Test databases use different filenames. A source Git commit does not back up a local SQLite database.
