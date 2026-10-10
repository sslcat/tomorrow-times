import fs from "node:fs";
import path from "node:path";
import { entities, storylines } from "../src/data/world";
import { celebrityProposals } from "../src/editorial/celebrity-proposals";
import { openShowcaseSnapshot } from "../src/lib/showcase";

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(file) : [file];
  });
}
const traceFiles = walk(".next/server/app").filter((file) =>
  file.endsWith(".nft.json"),
);
const traced = new Set<string>();
const snapshot = path.resolve(".showcase/published.sqlite");
for (const file of traceFiles) {
  const trace = JSON.parse(fs.readFileSync(file, "utf8")) as {
    files: string[];
  };
  const files = trace.files.map((entry) =>
    path.resolve(path.dirname(file), entry),
  );
  if (!files.includes(snapshot))
    throw new Error(`Snapshot missing from route trace: ${file}`);
  for (const entry of files) {
    if (!fs.existsSync(entry))
      throw new Error(
        `Missing traced artifact: ${path.relative(process.cwd(), entry)}`,
      );
    const relative = path
      .relative(process.cwd(), entry)
      .replaceAll(path.sep, "/");
    if (
      /^(data|backups|artifacts|\.git)\//.test(relative) ||
      /^\.env(?:\.|$)/.test(relative)
    ) {
      throw new Error("Private workspace data included in route trace");
    }
    traced.add(entry);
  }
}
if (!traceFiles.length || ![...traced].some((file) => file.endsWith(".node"))) {
  throw new Error("Missing server/native binary traces");
}
const privateStrings = [
  ...(entities.map((e) => e.privateFacts).filter(Boolean) as string[]),
  ...storylines.flatMap((s) => [...s.next, s.resolution]),
  ...celebrityProposals.map((p) => p.event.id),
];
const clientFiles = walk(".next/static").filter((file) =>
  /\.(?:js|map)$/.test(file),
);
for (const file of clientFiles) {
  const text = fs.readFileSync(file, "utf8");
  if (privateStrings.some((value) => value && text.includes(value)))
    throw new Error(`Private canon in client bundle: ${file}`);
}
const sql = openShowcaseSnapshot();
try {
  if (sql.pragma("integrity_check", { simple: true }) !== "ok")
    throw new Error("Snapshot integrity failed");
} finally {
  sql.close();
}
console.log(
  JSON.stringify(
    {
      routeTraces: traceFiles.length,
      tracedFiles: traced.size,
      tracedBytes: [...traced].reduce(
        (total, file) => total + fs.statSync(file).size,
        0,
      ),
      clientFilesChecked: clientFiles.length,
      snapshotBytes: fs.statSync(snapshot).size,
      privateRuntimeFiles: 0,
      privateClientMatches: 0,
    },
    null,
    2,
  ),
);
