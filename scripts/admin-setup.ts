import fs from "node:fs";
import { randomBytes } from "node:crypto";
const file = ".env.local";
const existing = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
if (/^ADMIN_TOKEN=.+$/m.test(existing)) {
  console.log("An admin token already exists in .env.local. No changes made.");
  process.exit(0);
}
const origin =
  process.env.CODESPACE_NAME &&
  process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN
    ? `https://${process.env.CODESPACE_NAME}-3000.${process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}`
    : "http://localhost:3000";
const retained = existing
  .split("\n")
  .filter(
    (line) => !/^LOCAL_ADMIN_ENABLED=|^ADMIN_TOKEN=|^ADMIN_ORIGIN=/.test(line),
  )
  .join("\n");
fs.writeFileSync(
  file,
  `${retained}\nLOCAL_ADMIN_ENABLED=true\nADMIN_TOKEN=${randomBytes(32).toString("hex")}\nADMIN_ORIGIN=${origin}\n`,
  { mode: 0o600 },
);
console.log(
  "A unique development-only admin token was written to ignored .env.local (mode 0600). Read it locally to sign in at /admin; restart dev after changing environment settings.",
);
