import { afterEach, describe, expect, it, vi } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import Database from "better-sqlite3";
import { buildShowcaseSnapshot } from "../scripts/lib/showcase-snapshot";
import { openShowcaseSnapshot } from "../src/lib/showcase";
import { adminEnabled } from "../src/lib/auth";
import { assertHostingMode } from "../src/lib/runtime-mode";
import { publicationUrl } from "../src/lib/publication";
import {
  allEntities,
  allStorylines,
  publishedEvents,
  getArticle,
  search,
  standings,
} from "../src/lib/queries";
import { entities, storylines } from "../src/data/world";
import { celebrityProposals } from "../src/editorial/celebrity-proposals";
import { testDb } from "./helpers";
import robots from "../src/app/robots";
import nextConfig from "../next.config";

afterEach(() => vi.unstubAllEnvs());
describe("read-only public showcase", () => {
  it("creates a deterministic public snapshot with no private canon or reader/editor state", () => {
    const bytes = buildShowcaseSnapshot();
    expect(bytes.equals(buildShowcaseSnapshot())).toBe(true);
    const sql = new Database(bytes);
    const source = testDb();
    try {
      expect(allEntities(sql)).toEqual(allEntities(source));
      expect(allStorylines(sql)).toEqual(allStorylines(source));
      expect(publishedEvents(sql)).toEqual(publishedEvents(source));
      expect(standings(sql)).toEqual(standings(source));
      const articles = source.prepare("SELECT id FROM articles").all() as {
        id: string;
      }[];
      expect(articles).toHaveLength(40);
      for (const { id } of articles)
        expect(getArticle(id, sql)).toEqual(getArticle(id, source));
      expect(
        sql.prepare("SELECT id FROM threads WHERE official=1").all(),
      ).toHaveLength(40);
      for (const table of [
        "canon",
        "audits",
        "settings",
        "jobs",
        "users",
        "comments",
        "reports",
        "reactions",
        "thread_follows",
        "rate_limits",
      ]) {
        expect(sql.prepare(`SELECT * FROM ${table}`).all(), table).toEqual([]);
      }
      const text = bytes.toString("utf8");
      for (const field of [
        "privateFacts",
        "motivation",
        "flaw",
        "arc",
        "resolution",
        "next",
      ]) {
        expect(text.includes(`\"${field}\":`), `private field ${field}`).toBe(
          false,
        );
      }
      for (const entity of entities) {
        for (const secret of [
          entity.privateFacts,
          entity.flaw,
          entity.arc,
        ].filter(Boolean) as string[])
          expect(text.includes(secret), `private notes for ${entity.id}`).toBe(
            false,
          );
      }
      for (const storyline of storylines) {
        for (const secret of [...storyline.next, storyline.resolution])
          expect(
            text.includes(secret),
            `future notes for ${storyline.id}`,
          ).toBe(false);
      }
      for (const proposal of celebrityProposals) {
        expect(text.includes(proposal.event.id)).toBe(false);
        expect(search(proposal.storyline.title, sql)).toEqual([]);
      }
    } finally {
      sql.close();
      source.close();
    }
  });
  it("opens a read-only artifact, rejects SQL writes, and never creates missing files", () => {
    const dir = fs.mkdtempSync(
      path.join(os.tmpdir(), "tomorrow-showcase-test-"),
    );
    const file = path.join(dir, "published.sqlite");
    try {
      fs.writeFileSync(file, buildShowcaseSnapshot(), { mode: 0o444 });
      const sql = openShowcaseSnapshot(file);
      try {
        expect(sql.readonly).toBe(true);
        expect(() => sql.exec("DELETE FROM articles")).toThrow(/readonly/);
        sql.pragma("query_only = OFF");
        expect(() =>
          sql.exec("INSERT INTO users VALUES ('x','x','reader',1,0)"),
        ).toThrow(/readonly/);
        expect(getArticle("lyra-after-the-lights", sql)?.publishedFiction).toBe(
          "3026-10-08",
        );
      } finally {
        sql.close();
      }
      expect(fs.readdirSync(dir)).toEqual(["published.sqlite"]);
      expect(() =>
        openShowcaseSnapshot(path.join(dir, "missing.sqlite")),
      ).toThrow();
      expect(fs.readdirSync(dir)).toEqual(["published.sqlite"]);
      const wrong = path.join(dir, "wrong.sqlite");
      new Database(wrong).close();
      expect(() => openShowcaseSnapshot(wrong)).toThrow(
        "Invalid showcase snapshot",
      );
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
  it("disables editor access in showcase mode even in development with valid configuration", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("LOCAL_ADMIN_ENABLED", "true");
    vi.stubEnv("ADMIN_TOKEN", "x".repeat(64));
    vi.stubEnv("SHOWCASE_MODE", "true");
    expect(adminEnabled()).toBe(false);
    vi.stubEnv("SHOWCASE_MODE", "false");
    vi.stubEnv("VERCEL", "1");
    expect(adminEnabled()).toBe(false);
    expect(() => assertHostingMode()).toThrow("read-only");
    vi.stubEnv("SHOWCASE_MODE", "true");
    expect(() => assertHostingMode()).not.toThrow();
  });
  it("uses validated metadata origins without credentials or private local defaults on Vercel", () => {
    expect(publicationUrl({})).toBe("http://localhost:3000");
    expect(
      publicationUrl({ VERCEL: "1", VERCEL_URL: "showcase.example.invalid" }),
    ).toBe("https://showcase.example.invalid");
    for (const origin of [
      "javascript:alert(1)",
      "https://user:pass@example.invalid",
      "https://example.invalid/private",
      "https://example.invalid?secret=x",
      "https://example.invalid#secret",
    ]) {
      expect(() => publicationUrl({ SITE_URL: origin })).toThrow();
    }
    expect(() => publicationUrl({ VERCEL: "1" })).toThrow();
    expect(() =>
      publicationUrl({ SITE_URL: "malformed configuration value" }),
    ).toThrow("SITE_URL must be a valid HTTP(S) origin");
  });
  it("discourages indexing provider previews and removes development CSP allowances", async () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    expect(robots()).toEqual({ rules: { userAgent: "*", disallow: "/" } });
    const headers = (await nextConfig.headers!())[0].headers;
    expect(headers).toContainEqual({
      key: "X-Robots-Tag",
      value: "noindex, nofollow",
    });
    const csp = headers.find(
      (header) => header.key === "Content-Security-Policy",
    )!.value;
    expect(csp).not.toContain("unsafe-eval");
    expect(csp).not.toContain("wss:");
    vi.stubEnv("VERCEL_ENV", "production");
    expect(
      (await nextConfig.headers!())[0].headers.some(
        (header) => header.key === "X-Robots-Tag",
      ),
    ).toBe(false);
    expect(robots().rules).toMatchObject({
      disallow: expect.arrayContaining(["/admin", "/api/"]),
    });
  });
});
