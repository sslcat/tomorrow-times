import Database from "better-sqlite3";
import { migrate, seed } from "../../src/lib/db";
import {
  allEntities,
  allStorylines,
  publishedEvents,
} from "../../src/lib/queries";

// Build only from versioned fixtures. Never open DATABASE_PATH or copy local data.
export function buildShowcaseSnapshot(): Buffer {
  const source = new Database(":memory:");
  const target = new Database(":memory:");
  try {
    migrate(source);
    seed(source);
    migrate(target);
    target.transaction(() => {
      for (const entity of allEntities(source)) {
        const { circumstance, ...publicFields } = entity;
        delete publicFields.age;
        // Reconstruct only the shape needed by publicEntity's allowlist.
        const document = { ...publicFields, state: { circumstance } };
        target
          .prepare(
            "INSERT INTO entities(id,kind,name,document) VALUES (?,?,?,?)",
          )
          .run(entity.id, entity.kind, entity.name, JSON.stringify(document));
      }
      for (const storyline of allStorylines(source)) {
        target
          .prepare("INSERT INTO storylines(id,title,document) VALUES (?,?,?)")
          .run(storyline.id, storyline.title, JSON.stringify(storyline));
      }
      for (const event of publishedEvents(source)) {
        const row = source
          .prepare(
            "SELECT fingerprint,approved_at,published_at FROM events WHERE id=?",
          )
          .get(event.id) as {
          fingerprint: string;
          approved_at: string;
          published_at: string;
        };
        target
          .prepare(
            "INSERT INTO events(id,fingerprint,date,storyline_id,status,document,approved_at,published_at) VALUES (?,?,?,?,'published',?,?,?)",
          )
          .run(
            event.id,
            row.fingerprint,
            event.date,
            event.storylineId,
            JSON.stringify(event),
            row.approved_at,
            row.published_at,
          );
      }
      // Fixed allowlist; the source has only reviewed opening-edition records.
      for (const table of [
        "articles",
        "article_events",
        "article_entities",
        "fixtures",
        "threads",
      ] as const) {
        for (const row of source
          .prepare(`SELECT * FROM ${table}`)
          .all() as Record<string, unknown>[]) {
          const columns = Object.keys(row);
          target
            .prepare(
              `INSERT INTO ${table}(${columns.join(",")}) VALUES (${columns.map(() => "?").join(",")})`,
            )
            .run(...Object.values(row));
        }
      }
      target
        .prepare("UPDATE migrations SET applied_at=?")
        .run("2026-10-09T18:00:00.000Z");
      target.exec(
        "CREATE TABLE showcase_manifest(version INTEGER NOT NULL); INSERT INTO showcase_manifest VALUES (1)",
      );
    })();
    if (
      target.pragma("integrity_check", { simple: true }) !== "ok" ||
      (target.pragma("foreign_key_check") as unknown[]).length
    ) {
      throw new Error("Showcase snapshot integrity check failed");
    }
    return target.serialize();
  } finally {
    source.close();
    target.close();
  }
}
