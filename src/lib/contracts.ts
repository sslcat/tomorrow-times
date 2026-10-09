import { z } from 'zod';
import { validDate } from './calendar';
export const dateSchema = z.string().refine(validDate, 'Use a valid YYYY-MM-DD calendar date');
export const idSchema = z.string().min(1).max(90).regex(/^[a-z0-9-]+$/);
export const sections = [
  ['interplanetary', 'Interplanetary Affairs'], ['politics', 'Politics'], ['crime', 'Crime & Justice'],
  ['business', 'Business & Economy'], ['science', 'Science & Technology'], ['entertainment', 'Entertainment'],
  ['sports', 'Sports'], ['culture', 'Culture & Lifestyle'], ['investigations', 'Investigations'],
  ['opinion', 'Opinion'], ['local', 'Local News'], ['oddities', 'Oddities'],
] as const;
export type Section = typeof sections[number][0];
export const sectionName = (id: string) => sections.find(s => s[0] === id)?.[1] || id;
export const entitySchema = z.object({
  id: idSchema, kind: z.enum(['person', 'location', 'organization']), name: z.string(), summary: z.string(),
  biography: z.string(), home: idSchema.optional(), birthDate: dateSchema.optional(), occupation: z.string().optional(),
  motivation: z.string().optional(), flaw: z.string().optional(), reputation: z.string().optional(),
  privateFacts: z.string().optional(), arc: z.string().optional(), visual: z.string(),
  state: z.record(z.string(), z.unknown()),
});
export type Entity = z.infer<typeof entitySchema>;
export type Storyline = { id: string; title: string; summary: string; status: string; participants: string[]; facts: string[]; questions: string[]; next: string[]; resolution: string };
const effectSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('state'), entityId: idSchema, key: z.enum(['circumstance', 'career', 'reputation']), value: z.string().min(1).max(1000) }),
  z.object({ type: z.literal('travel'), entityId: idSchema, from: idSchema, to: idSchema, departure: dateSchema, arrival: dateSchema }),
  z.object({ type: z.literal('death'), entityId: idSchema, date: dateSchema }),
  z.object({ type: z.literal('office'), entityId: idSchema, office: idSchema, jurisdiction: idSchema }),
  z.object({ type: z.literal('relationship'), entityId: idSchema, otherId: idSchema, relationship: z.enum(['married', 'divorced', 'rival', 'colleague']) }),
  z.object({ type: z.literal('ownership'), entityId: idSchema, ownerId: idSchema }),
  z.object({ type: z.literal('fixture'), fixtureId: idSchema, home: idSchema, away: idSchema, homeScore: z.number().int().min(0).max(99), awayScore: z.number().int().min(0).max(99) }),
]);
export const eventSchema = z.object({
  id: idSchema, fingerprint: idSchema, title: z.string().min(10).max(180), date: dateSchema,
  locationId: idSchema, jurisdiction: idSchema, participants: z.array(idSchema).min(1).max(20),
  storylineId: idSchema, causes: z.array(idSchema).max(10), facts: z.array(z.string().min(5).max(1500)).min(1).max(12),
  allegations: z.array(z.string().max(1500)).max(10), effects: z.array(effectSchema).max(20),
  rules: z.object({ ftl: z.boolean().default(false), communicationMinutes: z.number().nonnegative().optional(), communicationFrom: idSchema.optional() }),
});
export type CanonEvent = z.infer<typeof eventSchema>;
export const draftSchema = z.object({
  id: idSchema, title: z.string().min(10).max(180), dek: z.string().min(20).max(500),
  section: z.enum(sections.map(s => s[0]) as [Section, ...Section[]]),
  format: z.enum(['Report', 'Briefing', 'Feature', 'Interview', 'Analysis', 'Opinion', 'Investigation', 'Profile']),
  authorId: idSchema, body: z.array(z.string().min(20).max(4000)).min(2).max(25),
  eventIds: z.array(idSchema).min(1).max(10), entityIds: z.array(idSchema).min(1).max(30),
  storylineId: idSchema, art: z.enum(['mars', 'signal', 'stage', 'sport', 'habitat', 'cargo']),
  claims: z.array(z.object({ eventId: idSchema, fact: z.string() })).min(1).max(20),
});
export type Draft = z.infer<typeof draftSchema>;
export type Article = Draft & { status: string; publishedReal: string | null; publishedFiction: string | null; scheduledAt: string | null };
