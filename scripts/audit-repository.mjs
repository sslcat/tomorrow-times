import { execFileSync } from "node:child_process";
import fs from "node:fs";

// Local, value-redacted heuristic scan. Not a credential-validity check or a
// replacement for owner review. Never contact scanners or print matched values.
function runGit(args, options = {}) {
  try {
    return execFileSync("git", args, {
      maxBuffer: 64 * 1024 * 1024,
      ...options,
    });
  } catch {
    // Child-process errors can include raw stdout buffers. Do not print them.
    throw new Error("Local Git inspection failed; no raw output was logged");
  }
}
const git = (...args) => runGit(args);
const patterns = [
  [
    "provider-token",
    /(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}|AKIA[A-Z0-9]{16}|sk-(?:proj-)?[A-Za-z0-9_-]{24,}|xox[baprs]-[A-Za-z0-9-]{20,})/g,
  ],
  ["private-key", /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/g],
  [
    "credential-url",
    /(?:https?|postgres(?:ql)?|mysql|mongodb):\/\/[^\s/:]+:[^\s/@]+@/gi,
  ],
  [
    "literal-secret-assignment",
    /(?:ADMIN_TOKEN|API_KEY|SECRET_KEY|ACCESS_TOKEN|PASSWORD|CLIENT_SECRET)\s*(?:\|\|=|=|:)\s*["'][A-Za-z0-9_./+=-]{16,}["']/gi,
  ],
  [
    "private-preview-url",
    /https:\/\/[^\s<>`"']+\.(?:app\.github\.dev|githubpreview\.dev)/g,
  ],
  ["email-address", /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g],
  ["personal-home-path", /(?:\/Users\/[^/\s]+|[A-Z]:\\Users\\[^\\\s]+)/g],
];
const findings = [];
const binaries = [];
const oversized = [];
const sensitivePaths = [];
const historicalPaths = new Set();
let blobCount = 0;
let blobBytes = 0;
function inspect(bytes, location) {
  if (bytes.length > 1024 * 1024)
    oversized.push({ ...location, bytes: bytes.length });
  if (bytes.subarray(0, 8000).includes(0)) {
    binaries.push({ ...location, bytes: bytes.length });
    return;
  }
  const text = bytes.toString("utf8");
  for (const [category, pattern] of patterns) {
    for (const match of text.matchAll(pattern)) {
      findings.push({
        ...location,
        category,
        line: text.slice(0, match.index).split("\n").length,
      });
    }
  }
}
const objects = git("rev-list", "--objects", "--all")
  .toString()
  .trim()
  .split("\n");
const metadata = runGit(
  ["cat-file", "--batch-check=%(objectname) %(objecttype)"],
  {
    input: objects.map((row) => row.split(" ")[0]).join("\n") + "\n",
  },
)
  .toString()
  .trim()
  .split("\n");
for (let i = 0; i < objects.length; i++) {
  const [oid, type] = metadata[i].split(" ");
  const name = objects[i].slice(oid.length + 1);
  if (type === "blob") {
    const bytes = git("cat-file", "blob", oid);
    blobCount++;
    blobBytes += bytes.length;
    historicalPaths.add(name);
    if (
      /(^|\/)(\.env(?!\.example)(?:\.|$)|backups\/|artifacts\/)|^data\/|\.(sqlite(?:-wal|-shm)?|db|pem|key|p12|pfx|log|zip)$/.test(
        name,
      )
    )
      sensitivePaths.push({ path: name, object: oid.slice(0, 12) });
    inspect(bytes, { scope: "history", path: name, object: oid.slice(0, 12) });
  } else if (type === "commit" || type === "tag") {
    inspect(git("cat-file", type, oid), {
      scope: "metadata",
      path: type,
      object: oid.slice(0, 12),
    });
  }
}
const current = git(
  "ls-files",
  "--cached",
  "--others",
  "--exclude-standard",
  "-z",
)
  .toString()
  .split("\0")
  .filter(Boolean);
for (const file of new Set(current)) {
  if (fs.existsSync(file) && fs.lstatSync(file).isFile())
    inspect(fs.readFileSync(file), { scope: "working-tree", path: file });
}
const report = {
  scannedAt: new Date().toISOString(),
  head: git("rev-parse", "HEAD").toString().trim(),
  shallow:
    git("rev-parse", "--is-shallow-repository").toString().trim() === "true",
  reachableCommits: Number(git("rev-list", "--all", "--count").toString()),
  uniqueHistoricalBlobs: blobCount,
  historicalPaths: historicalPaths.size,
  reachableBlobBytes: blobBytes,
  currentFiles: new Set(current).size,
  sensitivePaths,
  oversized,
  binaries,
  findings,
  limitations:
    "Heuristic text scan of all locally reachable refs, commit/tag metadata and tracked/nonignored current files. Binary contents, encoded secrets, unreachable objects, external refs/issues/PRs and remote account settings require separate review. Findings include test fixtures and ordinary Git identities; no values are printed.",
};
fs.mkdirSync("artifacts/release-audit", { recursive: true });
fs.writeFileSync(
  "artifacts/release-audit/repository-scan.json",
  JSON.stringify(report, null, 2) + "\n",
);
console.log(
  JSON.stringify(
    {
      ...report,
      findings: undefined,
      binaries: undefined,
      findingCounts: Object.fromEntries(
        patterns.map(([category]) => [
          category,
          findings.filter((f) => f.category === category).length,
        ]),
      ),
      binaryCount: binaries.length,
      report: "artifacts/release-audit/repository-scan.json",
    },
    null,
    2,
  ),
);
if (report.shallow || sensitivePaths.length || findings.length)
  process.exitCode = 1;
