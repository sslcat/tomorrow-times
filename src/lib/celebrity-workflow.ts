import { celebrityProposals } from "../editorial/celebrity-proposals";
import { audit, type Sqlite } from "./db";
import { continuity } from "./continuity";
import { eventSchema, draftSchema } from "./contracts";
export function stageCelebrityProposals(sql: Sqlite, actor: string) {
  return sql.transaction(() => {
    const staged: string[] = [];
    for (const p of celebrityProposals) {
      if (sql.prepare("SELECT 1 FROM events WHERE id=?").get(p.event.id))
        continue;
      eventSchema.parse(p.event);
      draftSchema.parse(p.draft);
      if (
        sql.prepare("SELECT 1 FROM storylines WHERE id=?").get(p.storyline.id)
      )
        throw new Error("A proposal storyline ID is already in use");
      sql
        .prepare("INSERT INTO storylines(id,title,document) VALUES (?,?,?)")
        .run(p.storyline.id, p.storyline.title, JSON.stringify(p.storyline));
      const issues = continuity(sql, p.event);
      if (issues.some((i) => i.severity === "error"))
        throw new Error(issues.map((i) => i.message).join("; "));
      sql
        .prepare(
          "INSERT INTO events(id,fingerprint,date,storyline_id,status,document) VALUES (?,?,?,?,'proposed',?)",
        )
        .run(
          p.event.id,
          p.event.fingerprint,
          p.event.date,
          p.event.storylineId,
          JSON.stringify(p.event),
        );
      audit(sql, "proposal", p.event.id, actor, {
        provider: "V2 curated celebrity desk",
        event: p.event,
        issues,
        costCents: 0,
        followThrough: p.followThrough,
      });
      staged.push(p.event.id);
    }
    return staged;
  })();
}
