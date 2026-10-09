import fs from "node:fs";
import { spawnSync } from "node:child_process";
// Reuse optional Codespaces-local browser dependencies without changing system packages.
const libraries = "/tmp/tomorrow-browser-libs/usr/lib/x86_64-linux-gnu";
const browserCache = "/tmp/tomorrow-browsers";
const env = { ...process.env };
if (fs.existsSync(libraries))
  env.LD_LIBRARY_PATH = [libraries, env.LD_LIBRARY_PATH]
    .filter(Boolean)
    .join(":");
if (!env.PLAYWRIGHT_BROWSERS_PATH && fs.existsSync(browserCache))
  env.PLAYWRIGHT_BROWSERS_PATH = browserCache;
const result = spawnSync(
  process.execPath,
  ["node_modules/@playwright/test/cli.js", "test", ...process.argv.slice(2)],
  { stdio: "inherit", env },
);
if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}
process.exit(result.status ?? 1);
