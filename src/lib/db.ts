import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { world, entities, storylines } from "../data/world";
import { seedArticles, seedEvents } from "../data/edition";
import { draftSchema, entitySchema, eventSchema } from "./contracts";
import { assertHostingMode, showcaseEnabled } from "./runtime-mode";
import { openShowcaseSnapshot } from "./showcase";
export type Sqlite = Database.Database;
export function migrate(sql: Sqlite) {
  sql.pragma("foreign_keys = ON");
  sql.pragma("busy_timeout = 5000");
  sql.exec(
    "CREATE TABLE IF NOT EXISTS migrations (version INTEGER PRIMARY KEY, applied_at TEXT NOT NULL)",
  );
  if (!sql.prepare("SELECT 1 FROM migrations WHERE version=1").get()) {
    sql.transaction(() => {
      sql.exec(
        fs.readFileSync(
          path.join(process.cwd(), "db/migrations/0001_initial.sql"),
          "utf8",
        ),
      );
      sql
        .prepare("INSERT INTO migrations VALUES (?,?)")
        .run(1, new Date().toISOString());
    })();
  }
  if (!sql.prepare("SELECT 1 FROM migrations WHERE version=2").get()) {
    if (sql.name !== ":memory:") {
      fs.mkdirSync("backups", { recursive: true });
      const backup = path.resolve(
        "backups",
        `before-v2-${Date.now()}-${process.pid}.sqlite`,
      );
      sql.prepare("VACUUM INTO ?").run(backup);
    }
    sql.pragma("foreign_keys = OFF");
    try {
      sql.transaction(() => {
        sql.exec(
          fs.readFileSync(
            path.join(process.cwd(), "db/migrations/0002_reader_topics.sql"),
            "utf8",
          ),
        );
        if (sql.prepare("PRAGMA foreign_key_check").all().length)
          throw new Error("Migration foreign key check failed");
        sql
          .prepare("INSERT INTO migrations VALUES (?,?)")
          .run(2, new Date().toISOString());
      })();
    } finally {
      sql.pragma("foreign_keys = ON");
    }
  }
}
export function audit(
  sql: Sqlite,
  action: string,
  target: string,
  actor: string,
  after: unknown,
  before: unknown = null,
) {
  sql
    .prepare(
      "INSERT INTO audits(action,target,actor,created_at,before_json,after_json) VALUES (?,?,?,?,?,?)",
    )
    .run(
      action,
      target,
      actor,
      new Date().toISOString(),
      before === null ? null : JSON.stringify(before),
      JSON.stringify(after),
    );
}
export function officialThread(sql: Sqlite, articleId: string, now: string) {
  const a = sql
    .prepare(
      "SELECT title,section FROM articles WHERE id=? AND status='published'",
    )
    .get(articleId) as { title: string; section: string } | undefined;
  if (!a) throw new Error("Only published articles may have discussions");
  sql
    .prepare(
      "INSERT OR IGNORE INTO threads(id,article_id,title,section,official,created_at,updated_at) VALUES (?,?,?,?,1,?,?)",
    )
    .run(`discussion-${articleId}`, articleId, a.title, a.section, now, now);
}
export function seed(sql: Sqlite) {
  sql.transaction(() => {
    if (sql.prepare("SELECT 1 FROM canon WHERE id='world'").get()) return;
    entities.forEach((e) => entitySchema.parse(e));
    seedEvents.forEach((e) => eventSchema.parse(e));
    seedArticles.forEach((a) => draftSchema.parse(a));
    sql
      .prepare("INSERT INTO canon VALUES (?,?,?)")
      .run("world", world.version, JSON.stringify(world));
    const ent = sql.prepare(
      "INSERT INTO entities(id,kind,name,document) VALUES (?,?,?,?)",
    );
    entities.forEach((e) => ent.run(e.id, e.kind, e.name, JSON.stringify(e)));
    const story = sql.prepare(
      "INSERT INTO storylines(id,title,document) VALUES (?,?,?)",
    );
    storylines.forEach((s) => story.run(s.id, s.title, JSON.stringify(s)));
    const ev = sql.prepare(
      "INSERT INTO events(id,fingerprint,date,storyline_id,status,document,approved_at,published_at) VALUES (?,?,?,?,'published',?,?,?)",
    );
    seedEvents.forEach((e) => {
      const stamp = `${Number(e.date.slice(0, 4)) - 1000}${e.date.slice(4)}T18:00:00.000Z`;
      ev.run(
        e.id,
        e.fingerprint,
        e.date,
        e.storylineId,
        JSON.stringify(e),
        stamp,
        stamp,
      );
      e.effects.forEach((f) => {
        if (f.type === "fixture")
          sql
            .prepare("INSERT INTO fixtures VALUES (?,?,?,?,?,?)")
            .run(f.fixtureId, e.id, f.home, f.away, f.homeScore, f.awayScore);
      });
    });
    const ar = sql.prepare(
      "INSERT INTO articles(id,title,section,storyline_id,status,document,published_real,published_fiction) VALUES (?,?,?,?,'published',?,?,?)",
    );
    seedArticles.forEach((a) => {
      const { date, ...doc } = a;
      const stamp = `${Number(date.slice(0, 4)) - 1000}${date.slice(4)}T18:00:00.000Z`;
      ar.run(
        a.id,
        a.title,
        a.section,
        a.storylineId,
        JSON.stringify(doc),
        stamp,
        date,
      );
      a.eventIds.forEach((id) =>
        sql.prepare("INSERT INTO article_events VALUES (?,?)").run(a.id, id),
      );
      a.entityIds.forEach((id) =>
        sql.prepare("INSERT INTO article_entities VALUES (?,?)").run(a.id, id),
      );
      officialThread(sql, a.id, stamp);
    });
    sql.prepare("INSERT INTO settings VALUES (?,?)").run(
      "newsroom",
      JSON.stringify({
        paused: false,
        dailyLimit: 3,
        frequency: "manual",
        scheduledEnabled: false,
      }),
    );
    audit(sql, "seed", "edition-3026-10", "curated-offline", {
      worldVersion: 1,
      articles: seedArticles.length,
      events: seedEvents.length,
    });
  })();
}
let singleton: Sqlite | undefined;
export function getSql() {
  assertHostingMode();
  if (!singleton) {
    if (showcaseEnabled()) {
      singleton = openShowcaseSnapshot();
      return singleton;
    }
    const file = process.env.DATABASE_PATH || "./data/tomorrow-times.sqlite";
    fs.mkdirSync(path.dirname(path.resolve(file)), { recursive: true });
    singleton = new Database(file);
    singleton.pragma("journal_mode = WAL");
    migrate(singleton);
    seed(singleton);
  }
  return singleton;
}
export const getDb = () => drizzle(getSql());
