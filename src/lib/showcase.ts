import Database from "better-sqlite3";
import path from "node:path";

export function openShowcaseSnapshot(
  file = path.join(process.cwd(), ".showcase/published.sqlite"),
) {
  // Never fall back to the working database, seed, migrate, or create a file.
  const sql = new Database(file, { readonly: true, fileMustExist: true });
  try {
    const manifest = sql
      .prepare("SELECT version FROM showcase_manifest")
      .get() as { version: number } | undefined;
    if (manifest?.version !== 1) throw new Error("Invalid showcase snapshot");
    sql.pragma("query_only = ON");
    sql.pragma("foreign_keys = ON");
    return sql;
  } catch {
    sql.close();
    throw new Error("Invalid showcase snapshot; rebuild the reviewed edition");
  }
}
