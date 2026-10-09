import Database from "better-sqlite3";
import { migrate, seed } from "../src/lib/db";
import type { CanonEvent } from "../src/lib/contracts";
export function testDb() {
  const sql = new Database(":memory:");
  migrate(sql);
  seed(sql);
  return sql;
}
export const candidate = (): CanonEvent => ({
  id: "test-event",
  fingerprint: "test-event",
  title: "Neighbors plan a new shared supper",
  date: "3026-10-10",
  locationId: "ceres",
  jurisdiction: "ceres",
  participants: ["ada", "hana"],
  storylineId: "a-place-at-the-table",
  causes: ["care-rota"],
  facts: ["Neighbors agreed to review a shared supper plan."],
  allegations: [],
  effects: [],
  rules: { ftl: false },
});
