# Codespaces operations

Work directly in `/workspaces/tomorrow-times`, the owner’s existing checkout. This is remote Codespaces disk, not local Windows or OneDrive. No duplicate project, hosting account, public deployment or paid API is required.

The release audit later observed the repository already public while all forwarded ports remained private. Review [current privacy/history findings](PUBLIC_RELEASE_READINESS_REPORT.md) before sharing or pushing; this document does not authorize a visibility change.

## Preview

```bash
cd /workspaces/tomorrow-times
npm ci
npm run db:seed
npm run dev
```

Next.js listens on `0.0.0.0:3000`. Open the Codespaces **Ports** panel, forward port **3000**, leave its visibility **Private**, and choose **Open in Browser**. A typical address is `https://<codespace-name>-3000.<forwarding-domain>`; use the actual URL shown in Ports. Do not change visibility to Public. A forwarded development preview is not production hosting.

For the optional editor, run `npm run admin:setup` before starting development. Setup detects `CODESPACE_NAME` and `GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN` to configure the exact private `ADMIN_ORIGIN`. If browser sign-in is rejected for origin, correct that value in ignored `.env.local` and restart; do not weaken the check. The random editor token stays in that file.

For production-build verification, stop development first, then run `npm run build && npm run start`. The production build intentionally disables the development editorial desk. Browser tests use a separate loopback server on 3001 and isolated test databases; test servers stop when Playwright exits. Stop `npm run dev` before the editor browser suite, because Next.js permits only one development server per checkout even on different ports.

## Cost and storage

The build used the existing two-core machine. Dependencies, `.next`, browser binaries, database/WAL files, screenshots and backups use remote disk. Codespaces compute can consume included allowances or billable usage while running; storage can consume allowances or incur usage even while stopped. The owner’s actual account allowances have not been verified. A 1 TB OneDrive plan does not cover Codespaces storage. Codex plan usage, Codespaces usage and paid external API bills are separate.

No machine upgrade, paid provider, hosted database, account creation, trial, GitHub Actions workflow or deployment was enabled. Chromium headless shell is a free local testing dependency and was cached in `/tmp/tomorrow-browsers`. Original SVG source art is small and version controlled; generated screenshots are ignored.

## Safe shutdown

Stop the preview with **Ctrl+C** in its terminal. Stop the Codespace through GitHub/Codespaces when finished; closing a browser tab alone may leave compute running. Do not delete a Codespace containing unpushed commits or the only copy of its database. Remove generated test/build caches only after confirming the preview is stopped; never treat `data/` or `backups/` as disposable production data.

## Review and push only with owner approval

Local Git commits preserve work within this Codespace. **Unpushed work can be lost when the Codespace is deleted.** This build does not push automatically. After reviewing the commits, the owner can explicitly approve and execute:

```bash
cd /workspaces/tomorrow-times
git status --short
git log --oneline --decorate -8
git diff --stat origin/main..HEAD
git diff origin/main..HEAD
git push origin main
```

The last command pushes the local main branch to the existing repository and requires the owner’s approval. If the remote tracking branch is not available, use `git show --stat HEAD` and `git log --oneline` for local review, then inspect the configured remote before pushing. Do not change repository visibility.

A Git push backs up versioned source, migrations, fixtures and documentation. It does not back up ignored secrets, local canonical changes or SQLite data. Use `npm run db:backup` and an owner-approved secure destination for any valuable local editorial database. Never commit credentials to make backup easier.
