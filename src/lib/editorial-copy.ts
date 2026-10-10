import { createHash } from "node:crypto";
import type { Article, Draft } from "./contracts";
import revisions from "@/editorial/presentation.json";

export type PresentationRevision = {
  expectedHash: string;
  title: string;
  dek: string;
  opening?: string;
  evidence: string[];
};
export const presentationRevisions: Record<string, PresentationRevision> =
  revisions;
export function copyFingerprint(
  a: Pick<Draft, "title" | "dek" | "body" | "eventIds">,
) {
  return createHash("sha256")
    .update(JSON.stringify([a.title, a.dek, a.body, a.eventIds]))
    .digest("hex");
}
export function presentArticle(a: Article): Article {
  const revision = presentationRevisions[a.id];
  // A later correction, edit or retraction always takes precedence over V2 copy.
  if (
    a.status !== "published" ||
    (a.revision !== undefined && a.revision !== 1) ||
    !revision ||
    copyFingerprint(a) !== revision.expectedHash
  )
    return a;
  return {
    ...a,
    title: revision.title,
    dek: revision.dek,
    body: revision.opening ? [revision.opening, ...a.body.slice(1)] : a.body,
    presentation: {
      version: "V2 · 2026-10-10",
      title: a.title,
      dek: a.dek,
      body: a.body,
    },
  };
}
