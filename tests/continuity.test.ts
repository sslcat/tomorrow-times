import { beforeEach, afterEach, describe, it, expect } from "vitest";
import type { Sqlite } from "../src/lib/db";
import { continuity } from "../src/lib/continuity";
import { candidate, testDb } from "./helpers";
import type { Entity } from "../src/lib/contracts";
let sql: Sqlite;
beforeEach(() => {
  sql = testDb();
});
afterEach(() => sql.close());
function state(id: string, values: Record<string, unknown>) {
  const e = JSON.parse(
    (
      sql.prepare("SELECT document FROM entities WHERE id=?").get(id) as {
        document: string;
      }
    ).document,
  ) as Entity;
  Object.assign(e.state, values);
  sql
    .prepare("UPDATE entities SET document=? WHERE id=?")
    .run(JSON.stringify(e), id);
}
const codes = (input: unknown) => continuity(sql, input).map((i) => i.code);
describe("canon constraints", () => {
  it("accepts an ordinary feasible event", () =>
    expect(codes(candidate())).toEqual([]));
  it("rejects nonexistent entities and malformed dates", () => {
    const e = candidate();
    e.participants.push("nobody");
    expect(codes(e)).toContain("entity");
    e.date = "3026-02-30";
    expect(codes(e)).toContain("schema");
  });
  it("rejects participants not yet born or impossibly old", () => {
    const e = candidate();
    e.date = "2800-01-01";
    expect(codes(e)).toContain("age");
    e.date = "3300-01-01";
    expect(codes(e)).toContain("age");
  });
  it("rejects participation after a recorded death", () => {
    state("ada", { deathDate: "3026-10-08" });
    expect(codes(candidate())).toContain("death");
  });
  it("rejects duplicate and chronologically inverted events", () => {
    const e = candidate();
    e.fingerprint = "care-rota";
    expect(codes(e)).toContain("duplicate");
    e.date = "3026-10-08";
    expect(codes(e)).toContain("chronology");
  });
  it("rejects unknown causes and mismatched jurisdiction", () => {
    const e = candidate();
    e.causes = ["missing"];
    e.jurisdiction = "ares";
    expect(codes(e)).toEqual(expect.arrayContaining(["cause", "jurisdiction"]));
  });
  it("enforces transit times and departure location", () => {
    const e = candidate();
    e.effects = [
      {
        type: "travel",
        entityId: "hana",
        from: "ceres",
        to: "ares",
        departure: "3026-10-09",
        arrival: e.date,
      },
    ];
    expect(codes(e)).toContain("travel");
    e.effects = [
      {
        type: "travel",
        entityId: "hana",
        from: "ceres",
        to: "ares",
        departure: "3026-09-01",
        arrival: e.date,
      },
    ];
    expect(codes(e)).not.toContain("travel");
    state("hana", { location: "earth" });
    expect(codes(e)).toContain("travel");
  });
  it("rejects undefined routes and overlapping journeys", () => {
    const e = candidate();
    e.effects = [
      {
        type: "travel",
        entityId: "hana",
        from: "ceres",
        to: "titan",
        departure: "3026-01-01",
        arrival: e.date,
      },
    ];
    expect(codes(e)).toContain("travel");
    state("hana", { lastArrival: "3026-10-09" });
    e.effects[0] = {
      type: "travel",
      entityId: "hana",
      from: "ceres",
      to: "ares",
      departure: "3026-09-01",
      arrival: e.date,
    };
    expect(codes(e)).toContain("travel");
  });
  it("rejects FTL and impossible message latency", () => {
    const e = candidate();
    e.rules = {
      ftl: true,
      communicationFrom: "titan",
      communicationMinutes: 1,
    };
    expect(codes(e)).toEqual(expect.arrayContaining(["ftl", "latency"]));
  });
  it("rejects contradictory political office and jurisdiction", () => {
    const e = candidate();
    e.effects = [
      {
        type: "office",
        entityId: "ivo",
        office: "ares-steward",
        jurisdiction: "ares",
      },
    ];
    expect(codes(e)).toEqual(
      expect.arrayContaining(["office", "jurisdiction"]),
    );
  });
  it("enforces reciprocal relationship history and adulthood", () => {
    const e = candidate();
    e.effects = [
      {
        type: "relationship",
        entityId: "hana",
        otherId: "oren",
        relationship: "married",
      },
    ];
    expect(codes(e)).toContain("relationship");
    e.effects = [
      {
        type: "relationship",
        entityId: "noa",
        otherId: "oren",
        relationship: "married",
      },
    ];
    expect(codes(e)).toContain("relationship");
    e.effects = [
      {
        type: "relationship",
        entityId: "hana",
        otherId: "eli",
        relationship: "divorced",
      },
    ];
    expect(codes(e)).not.toContain("relationship");
  });
  it("rejects inconsistent death dates and duplicate deaths", () => {
    const e = candidate();
    e.effects = [{ type: "death", entityId: "ada", date: "3026-10-11" }];
    expect(codes(e)).toContain("chronology");
    state("ada", { deathDate: "3026-10-09" });
    expect(codes(e)).toContain("death");
  });
  it("rejects unknown owners, self ownership and ownership cycles", () => {
    const e = candidate();
    e.effects = [{ type: "ownership", entityId: "helix", ownerId: "nobody" }];
    expect(codes(e)).toContain("ownership");
    e.effects = [{ type: "ownership", entityId: "helix", ownerId: "helix" }];
    expect(codes(e)).toContain("ownership");
    state("meridian", { owner: "helix" });
    e.effects = [{ type: "ownership", entityId: "helix", ownerId: "meridian" }];
    expect(codes(e)).toContain("ownership");
  });
  it("rejects repeated, impossible and inconsistent fixtures", () => {
    const e = candidate();
    e.effects = [
      {
        type: "fixture",
        fixtureId: "round1-comets-saints",
        home: "comets",
        away: "saints",
        homeScore: 9,
        awayScore: 0,
      },
    ];
    expect(codes(e)).toContain("fixture");
    e.effects = [
      {
        type: "fixture",
        fixtureId: "new-fixture",
        home: "comets",
        away: "comets",
        homeScore: 2,
        awayScore: 2,
      },
    ];
    expect(codes(e)).toContain("fixture");
  });
  it("flags uncertainty for a human, without calling an allegation fact", () => {
    const e = candidate();
    e.allegations = ["An unnamed neighbor alleges that the rota was changed."];
    expect(continuity(sql, e)).toContainEqual(
      expect.objectContaining({ code: "allegation", severity: "review" }),
    );
  });
});
