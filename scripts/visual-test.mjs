import fs from "node:fs";
import { spawnSync } from "node:child_process";
const env = { ...process.env };
const libraries = "/tmp/tomorrow-browser-libs/usr/lib/x86_64-linux-gnu";
if (fs.existsSync(libraries))
  env.LD_LIBRARY_PATH = [libraries, env.LD_LIBRARY_PATH]
    .filter(Boolean)
    .join(":");
if (!env.PLAYWRIGHT_BROWSERS_PATH && fs.existsSync("/tmp/tomorrow-browsers"))
  env.PLAYWRIGHT_BROWSERS_PATH = "/tmp/tomorrow-browsers";
const result = spawnSync(process.execPath, ["scripts/visual-review.mjs"], {
  stdio: "inherit",
  env,
});
if (result.error) console.error(result.error.message);
process.exit(result.status ?? 1);
