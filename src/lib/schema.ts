import {
  sqliteTable,
  text,
  integer,
  primaryKey,
} from "drizzle-orm/sqlite-core";
import type { Entity, Storyline, CanonEvent, Draft } from "./contracts";
export const entitiesTable = sqliteTable("entities", {
  id: text("id").primaryKey(),
  kind: text("kind").notNull(),
  name: text("name").notNull(),
  document: text("document", { mode: "json" }).$type<Entity>().notNull(),
  revision: integer("revision").notNull(),
});
export const storylinesTable = sqliteTable("storylines", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  document: text("document", { mode: "json" }).$type<Storyline>().notNull(),
  revision: integer("revision").notNull(),
});
export const eventsTable = sqliteTable("events", {
  id: text("id").primaryKey(),
  fingerprint: text("fingerprint").notNull(),
  date: text("date").notNull(),
  storylineId: text("storyline_id").notNull(),
  status: text("status").notNull(),
  document: text("document", { mode: "json" }).$type<CanonEvent>().notNull(),
  approvedAt: text("approved_at"),
  publishedAt: text("published_at"),
});
export const articlesTable = sqliteTable("articles", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  section: text("section").notNull(),
  storylineId: text("storyline_id").notNull(),
  status: text("status").notNull(),
  document: text("document", { mode: "json" }).$type<Draft>().notNull(),
  publishedReal: text("published_real"),
  publishedFiction: text("published_fiction"),
  scheduledAt: text("scheduled_at"),
  revision: integer("revision").notNull(),
});
export const articleEntitiesTable = sqliteTable(
  "article_entities",
  {
    articleId: text("article_id").notNull(),
    entityId: text("entity_id").notNull(),
  },
  (t) => [primaryKey({ columns: [t.articleId, t.entityId] })],
);
