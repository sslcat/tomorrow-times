import { afterEach, beforeEach, describe, expect, it } from "vitest";
import fs from "node:fs";
import { testDb } from "./helpers";
import type { Sqlite } from "../src/lib/db";
import { seedArticles } from "../src/data/edition";
import {
  allEntities,
  allStorylines,
  getArticle,
  publishedEvents,
  search,
} from "../src/lib/queries";
import {
  correctArticle,
  approveEvent,
  draftEvent,
  approveDraft,
  publish,
} from "../src/lib/newsroom";
import { stageCelebrityProposals } from "../src/lib/celebrity-workflow";
import { celebrityProposals } from "../src/editorial/celebrity-proposals";
import { presentationRevisions } from "../src/lib/editorial-copy";
import {
  editorialImages,
  resolveEditorialImage,
} from "../src/lib/editorial-images";
import {
  entertainmentArticles,
  peopleToWatch,
  selectArticles,
} from "../src/lib/frontpage";
import briefs from "../src/editorial/image-briefs.json";
let sql: Sqlite;
beforeEach(() => {
  sql = testDb();
});
afterEach(() => sql.close());
describe("V2 presentation preserves reporting", () => {
  it("preserves all canonical links, timestamps, classifications and original documents while exposing clear copy", () => {
    const before = sql.prepare("SELECT * FROM articles ORDER BY id").all();
    for (const seed of seedArticles) {
      const a = getArticle(seed.id, sql)!;
      expect(a.title).toBe(presentationRevisions[seed.id].title);
      expect(a.presentation?.title).toBe(seed.title);
      expect(a.presentation?.body).toEqual(seed.body);
      expect(a.publishedFiction).toBe(seed.date);
      expect(a.eventIds).toEqual(seed.eventIds);
      expect(a.entityIds).toEqual(seed.entityIds);
      expect(a.storylineId).toBe(seed.storylineId);
      expect(a.section).toBe(seed.section);
      expect(a.claims).toEqual(seed.claims);
      expect(search(a.title, sql).some((r) => r.id === a.id)).toBe(true);
      expect(search(seed.title, sql).some((r) => r.id === a.id)).toBe(true);
    }
    expect(sql.prepare("SELECT * FROM articles ORDER BY id").all()).toEqual(
      before,
    );
  });
  it("never masks a later correction or retraction with an old presentation rewrite", () => {
    const seed = seedArticles.find((a) => a.id === "lyra-after-the-lights")!;
    correctArticle(
      sql,
      seed.id,
      "Editor reviewed a subsequent clarification.",
      "Lyra benefit: a reviewed clarification",
      seed.body,
      "test",
    );
    expect(getArticle(seed.id, sql)?.presentation).toBeUndefined();
    expect(getArticle(seed.id, sql)?.title).toBe(
      "Lyra benefit: a reviewed clarification",
    );
    correctArticle(
      sql,
      seed.id,
      "The report has been withdrawn for review.",
      seed.title,
      seed.body,
      "test",
      true,
    );
    expect(getArticle(seed.id, sql)?.presentation).toBeUndefined();
    expect(search("Lyra Saye postpones", sql)).toEqual([]);
  });
  it("yields even to a correction that retains the original words", () => {
    const seed = seedArticles[0];
    correctArticle(
      sql,
      seed.id,
      "Editor reaffirmed the original published copy.",
      seed.title,
      seed.body,
      "test",
    );
    expect(getArticle(seed.id, sql)?.presentation).toBeUndefined();
    expect(getArticle(seed.id, sql)?.title).toBe(seed.title);
  });
  it("uses real published coverage for people counts and curation, excluding retracted or missing stories", () => {
    const articles = seedArticles.map((a) => getArticle(a.id, sql)!);
    expect(entertainmentArticles(articles)).toHaveLength(5);
    const people = peopleToWatch(articles, allEntities(sql));
    for (const e of people)
      expect(e.reports).toBe(
        articles.filter((a) => a.entityIds.includes(e.id)).length,
      );
    expect(selectArticles(articles, ["missing", articles[0].id])).toHaveLength(
      1,
    );
    expect(
      selectArticles(
        [{ ...articles[0], status: "retracted" }],
        [articles[0].id],
      ),
    ).toEqual([]);
  });
});
describe("celebrity proposals respect the existing review boundary", () => {
  it("stages three validated private arcs idempotently without public content, fixtures, entities or threads changing", () => {
    const before = {
      articles: sql.prepare("SELECT * FROM articles").all(),
      entities: allEntities(sql),
      events: publishedEvents(sql),
      threads: sql.prepare("SELECT * FROM threads").all(),
      fixtures: sql.prepare("SELECT * FROM fixtures").all(),
    };
    expect(stageCelebrityProposals(sql, "test")).toHaveLength(3);
    expect(stageCelebrityProposals(sql, "test")).toEqual([]);
    expect(allStorylines(sql)).toHaveLength(8);
    for (const p of celebrityProposals) {
      expect(search(p.storyline.title, sql)).toEqual([]);
      expect(search(p.event.title, sql)).toEqual([]);
      expect(getArticle(p.draft.id, sql)).toBeUndefined();
    }
    expect({
      articles: sql.prepare("SELECT * FROM articles").all(),
      entities: allEntities(sql),
      events: publishedEvents(sql),
      threads: sql.prepare("SELECT * FROM threads").all(),
      fixtures: sql.prepare("SELECT * FROM fixtures").all(),
    }).toEqual(before);
  });
  it.each(celebrityProposals)(
    "requires both approvals and publishes $storyline.id with its canonical sources",
    async (p) => {
      stageCelebrityProposals(sql, "test");
      await expect(draftEvent(sql, p.event.id, "test")).rejects.toThrow(
        "Approve",
      );
      approveEvent(sql, p.event.id, "test", true);
      expect(allStorylines(sql).some((s) => s.id === p.storyline.id)).toBe(
        false,
      );
      const id = await draftEvent(sql, p.event.id, "test");
      expect(() =>
        publish(sql, id, "test", new Date("2026-10-10T18:00:00Z")),
      ).toThrow("approval");
      approveDraft(sql, id, "test");
      publish(sql, id, "test", new Date("2026-10-10T18:00:00Z"));
      expect(getArticle(id, sql)?.title).toBe(p.draft.title);
      expect(
        allStorylines(sql).find((s) => s.id === p.storyline.id)?.facts,
      ).toEqual(p.event.facts);
      expect(
        allStorylines(sql).find((s) => s.id === p.storyline.id)?.status,
      ).toBe("Unfolding");
      expect(
        sql.prepare("SELECT * FROM threads WHERE article_id=?").all(id),
      ).toHaveLength(1);
    },
  );
});
describe("truthful, local imagery", () => {
  it("has an explicit assignment for every article and public entity, valid local approved assets, and no pending face files", () => {
    for (const id of [
      ...seedArticles.map((a) => a.id),
      ...allEntities(sql).map((e) => e.id),
    ])
      expect(editorialImages[id]).toBeDefined();
    for (const image of Object.values(editorialImages)) {
      expect(image.rights).not.toBe("");
      expect(image.credit).not.toBe("");
      expect(image.alt).not.toBe("");
      if (image.src) {
        expect(image.status).toBe("approved");
        expect(image.src.startsWith("/art/")).toBe(true);
        expect(fs.existsSync(`public${image.src}`)).toBe(true);
      }
      if (image.entityType === "character") {
        expect(image.status).toBe("pending");
        expect(image.src).toBeUndefined();
        expect(image.reference.approvedCharacterRefs).toEqual([]);
      }
    }
    expect(resolveEditorialImage("../../etc/passwd").src).toBeUndefined();
  });
  it("keeps generation unconnected and the requested briefs unapproved", () => {
    expect(briefs.generatorConnected).toBe(false);
    expect(briefs.approvedBudgetCents).toBe(0);
    expect(briefs.articleBriefs).toHaveLength(10);
    expect(briefs.characterBriefs).toHaveLength(8);
    for (const b of [...briefs.articleBriefs, ...briefs.characterBriefs]) {
      expect(b.status).toBe("pending");
      expect(b.generationApproval).toBeNull();
      expect(b.reviewApproval).toBeNull();
      expect(b.characterReferenceIds).toEqual([]);
    }
  });
});
