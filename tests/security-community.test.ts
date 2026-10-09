import { beforeEach, afterEach, describe, it, expect, vi } from "vitest";
import { testDb } from "./helpers";
import type { Sqlite } from "../src/lib/db";
import {
  requireReader,
  postComment,
  createTopic,
  reportComment,
  moderate,
  rateLimit,
  listThreads,
  visibleThread,
  toggleReaction,
} from "../src/lib/community";
import {
  adminEnabled,
  allowedOrigin,
  createSession,
  validSession,
} from "../src/lib/auth";
import { generateProposal } from "../src/lib/newsroom";
let sql: Sqlite;
beforeEach(() => {
  sql = testDb();
  for (const [id, role, verified, suspended] of [
    ["reader", "reader", 1, 0],
    ["moderator", "moderator", 1, 0],
    ["unverified", "reader", 0, 0],
    ["suspended", "reader", 1, 1],
  ])
    sql
      .prepare("INSERT INTO users VALUES (?,?,?,?,?)")
      .run(id, id, role, verified, suspended);
});
afterEach(() => {
  sql.close();
  vi.unstubAllEnvs();
});
const thread = "discussion-the-water-that-isnt-there";
describe("permissions and community foundations", () => {
  it("rejects anonymous, unverified and suspended writers", () => {
    for (const id of [null, "unverified", "suspended", "missing"])
      expect(() => requireReader(sql, id)).toThrow();
    expect(() => requireReader(sql, "reader", true)).toThrow("Moderator");
  });
  it("allows multiple reader topics linked to one published article", () => {
    createTopic(
      sql,
      "reader",
      "the-water-that-isnt-there",
      "A first discussion topic",
    );
    createTopic(
      sql,
      "reader",
      "the-water-that-isnt-there",
      "A second discussion topic",
    );
    expect(
      sql.prepare("SELECT * FROM threads WHERE official=0").all(),
    ).toHaveLength(2);
  });
  it("enforces input limits, thread identity and reply ownership", () => {
    expect(() =>
      postComment(sql, "reader", thread, "x".repeat(4001)),
    ).toThrow();
    const id = postComment(sql, "reader", thread, "An interesting question.");
    expect(() =>
      postComment(
        sql,
        "reader",
        "discussion-the-night-oven",
        "A reply to another thread.",
        id,
      ),
    ).toThrow("belong");
    expect(() =>
      postComment(
        sql,
        "reader",
        "unpublished-thread",
        "An interesting question.",
      ),
    ).toThrow();
  });
  it("stores untrusted text literally without treating it as canon", () => {
    const before = sql.prepare("SELECT document FROM canon").all();
    const id = postComment(
      sql,
      "reader",
      thread,
      '<script>alert("test")</script>',
    );
    expect(
      (
        sql.prepare("SELECT body FROM comments WHERE id=?").get(id) as {
          body: string;
        }
      ).body,
    ).toContain("<script>");
    expect(sql.prepare("SELECT document FROM canon").all()).toEqual(before);
  });
  it("isolates unpublished source content even if a thread exists", async () => {
    await generateProposal(
      sql,
      "isolation-key",
      "test",
      new Date("2026-10-10T18:00:00Z"),
    );
    sql
      .prepare(
        "UPDATE articles SET status='draft' WHERE id='the-water-that-isnt-there'",
      )
      .run();
    expect(visibleThread(sql, thread)).toBeUndefined();
    expect(listThreads(sql).some((t) => t.id === thread)).toBe(false);
    expect(() =>
      createTopic(
        sql,
        "reader",
        "the-water-that-isnt-there",
        "An unpublished topic",
      ),
    ).toThrow("published");
  });
  it("deduplicates reports, requires moderator access and audits decisions", () => {
    const id = postComment(
      sql,
      "reader",
      thread,
      "This is a disputed reader theory.",
    );
    reportComment(sql, "reader", id, "This needs a moderation review.");
    reportComment(sql, "reader", id, "Reporting the same comment again.");
    expect(sql.prepare("SELECT * FROM reports").all()).toHaveLength(1);
    expect(() =>
      moderate(sql, "reader", id, "hide", "A sufficient reason."),
    ).toThrow("Moderator");
    moderate(sql, "moderator", id, "hide", "Hidden after a context review.");
    expect(
      (
        sql.prepare("SELECT hidden FROM comments WHERE id=?").get(id) as {
          hidden: number;
        }
      ).hidden,
    ).toBe(1);
    moderate(
      sql,
      "moderator",
      id,
      "restore",
      "Restored after a second review.",
    );
    expect(
      sql
        .prepare("SELECT * FROM audits WHERE action LIKE 'moderation-%'")
        .all(),
    ).toHaveLength(2);
  });
  it("enforces durable rate limits and expiry", () => {
    rateLimit(sql, "test-key", 2, 1000, 100);
    rateLimit(sql, "test-key", 2, 1000, 200);
    expect(() => rateLimit(sql, "test-key", 2, 1000, 300)).toThrow(
      "Rate limit",
    );
    expect(() => rateLimit(sql, "test-key", 2, 1000, 1200)).not.toThrow();
  });
  it("counts real participation and toggles reactions only for visible comments", () => {
    const id = postComment(
      sql,
      "reader",
      thread,
      "A reasoned response to the reporting.",
    );
    toggleReaction(sql, "reader", id);
    toggleReaction(sql, "reader", id);
    expect(sql.prepare("SELECT * FROM reactions").all()).toHaveLength(0);
    expect(listThreads(sql, "popular")[0]).toMatchObject({
      id: thread,
      comment_count: 1,
    });
    moderate(sql, "moderator", id, "hide", "Hidden after moderation review.");
    expect(() => toggleReaction(sql, "reader", id)).toThrow();
  });
  it("enforces suspensions on subsequent actions", () => {
    moderate(
      sql,
      "moderator",
      "reader",
      "suspend",
      "Repeated abuse after review.",
    );
    expect(() =>
      postComment(sql, "reader", thread, "Trying to post again."),
    ).toThrow("active");
  });
});
describe("local editor boundary", () => {
  it("is disabled without explicit configuration and always in production", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("LOCAL_ADMIN_ENABLED", "false");
    vi.stubEnv("ADMIN_TOKEN", "a".repeat(64));
    expect(adminEnabled()).toBe(false);
    vi.stubEnv("LOCAL_ADMIN_ENABLED", "true");
    expect(adminEnabled()).toBe(true);
    vi.stubEnv("NODE_ENV", "production");
    expect(adminEnabled()).toBe(false);
  });
  it("verifies signed expiring cookies and rejects forged sessions", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("LOCAL_ADMIN_ENABLED", "true");
    vi.stubEnv("ADMIN_TOKEN", "a".repeat(64));
    const now = Date.now(),
      cookie = createSession(now);
    expect(validSession(cookie, now)).toBe(true);
    expect(validSession(cookie + "x", now)).toBe(false);
    expect(validSession(cookie, now + 8 * 3600000 + 1)).toBe(false);
    vi.stubEnv("ADMIN_TOKEN", "b".repeat(64));
    expect(validSession(cookie, now)).toBe(false);
  });
  it("rejects absent and foreign origins including misleading suffixes", () => {
    vi.stubEnv("ADMIN_ORIGIN", "http://localhost:3000");
    expect(
      allowedOrigin(
        new Request("http://localhost:3000/api/admin", {
          headers: { origin: "http://localhost:3000" },
        }),
      ),
    ).toBe(true);
    for (const origin of [
      "https://evil.example",
      "http://localhost:3000.evil.example",
      "null",
    ])
      expect(
        allowedOrigin(
          new Request("http://localhost:3000/api/admin", {
            headers: { origin },
          }),
        ),
      ).toBe(false);
    expect(allowedOrigin(new Request("http://localhost:3000/api/admin"))).toBe(
      false,
    );
  });
});
