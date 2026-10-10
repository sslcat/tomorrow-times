import fs from "node:fs";
import { getSql, audit } from "../src/lib/db";
import { stageCelebrityProposals } from "../src/lib/celebrity-workflow";
const sql = getSql();
fs.mkdirSync("backups", { recursive: true });
const backup = `backups/before-v2-proposals-${Date.now()}.sqlite`;
await sql.backup(backup);
const ids = stageCelebrityProposals(sql, "owner-requested-v2-preparation");
audit(
  sql,
  "v2-proposal-pack",
  "celebrity-first-v2",
  "owner-requested-v2-preparation",
  { ids, backup, publication: false },
);
console.log(JSON.stringify({ backup, staged: ids, publication: false }));
