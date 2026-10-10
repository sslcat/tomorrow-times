/** Local, reviewed illustration assignments. No generator or remote asset loader. */
import fallbacks from "@/editorial/image-fallbacks.json";
import { z } from "zod";
export type EditorialImageRecord = {
  id: string;
  entityType: "article" | "character" | "entity";
  status: "approved" | "pending" | "placeholder";
  src?: string;
  rights: string;
  credit: string;
  alt: string;
  treatmentLabel?: string;
  crop: "landscape" | "portrait";
  focalPoint: [number, number];
  reference: {
    canonIds: string[];
    approvedCharacterRefs: string[];
    briefId?: string;
  };
};
const imageRecordSchema = z.object({
  treatmentLabel: z.string().optional(),
  id: z.string(),
  entityType: z.enum(["article", "character", "entity"]),
  status: z.enum(["approved", "pending", "placeholder"]),
  src: z.string().optional(),
  rights: z.string(),
  credit: z.string(),
  alt: z.string(),
  crop: z.enum(["landscape", "portrait"]),
  focalPoint: z.tuple([z.number().min(0).max(100), z.number().min(0).max(100)]),
  reference: z.object({
    canonIds: z.array(z.string()),
    approvedCharacterRefs: z.array(z.string()),
    briefId: z.string().optional(),
  }),
});
const assignments = [
  [
    "lyra-after-the-lights",
    "afterlight",
    "An empty microphone on a violet-lit stage beneath sweeping acoustic ribs; original illustration, not an approved venue design.",
    "benefit-delay",
    65,
    48,
  ],
  [
    "teo-voss-room-tone",
    "room-tone",
    "A record and acoustic wall in a quiet rehearsal space; a conceptual illustration of Teo’s solo release.",
    "room-recording",
    63,
    53,
  ],
  [
    "the-crew-contract",
    "crew",
    "Road cases, stage cables and work lights; an original illustration of the labor behind a postponed show.",
    "benefit-delay",
    55,
    52,
  ],
  [
    "a-signal-without-a-name",
    "europa",
    "A suspended sensor and repeating sound trace below layers of ice; a conceptual illustration, not scientific measurement data.",
    "sensor-test",
    60,
    55,
  ],
  [
    "a-captain-and-a-consignee",
    "cargo-hold",
    "Sealed cargo cases behind an amber Ceres Dock Service hold marker; fictional editorial illustration.",
    "cargo-order",
    57,
    53,
  ],
  [
    "four-three-and-a-loose-question",
    "cage",
    "A low-gravity cage with the canonical Comets–Saints score, 4–3; an editorial illustration of the opening match.",
    "comets-saints",
    50,
    50,
  ],
] as const;
export const editorialImages: Record<string, EditorialImageRecord> = {
  ...Object.fromEntries(
    Object.entries(fallbacks).map(([id, asset]) => [
      id,
      imageRecordSchema.parse(asset),
    ]),
  ),
  ...Object.fromEntries(
    assignments.map(([id, asset, alt, event, x, y]) => [
      id,
      {
        id: `v2-${asset}`,
        entityType: "article",
        status: "approved",
        src: `/art/v2/${asset}.svg`,
        rights:
          "Original Tomorrow Times SVG, created for this repository. No third-party material.",
        credit: "Tomorrow Times / Original editorial illustration",
        alt,
        crop: "landscape",
        focalPoint: [x, y],
        reference: {
          canonIds: [event],
          approvedCharacterRefs: [],
          briefId: id,
        },
      },
    ]),
  ),
};
export const characterImageIds = [
  "lyra",
  "teo",
  "mara",
  "tavi",
  "pema",
  "cato",
  "nadi",
  "esme",
];
for (const id of characterImageIds)
  editorialImages[id] = {
    id: `portrait-${id}`,
    entityType: "character",
    status: "pending",
    rights: "No portrait approved. Original typographic monogram only.",
    credit: "Tomorrow Times / Identity monogram",
    alt: "Character identity monogram; portrait reference pending.",
    crop: "portrait",
    focalPoint: [50, 50],
    reference: {
      canonIds: [id],
      approvedCharacterRefs: [],
      briefId: `portrait-${id}`,
    },
  };
// Existing source art is retained, with explicit place assignments rather than inferred identities.
for (const id of ["ares", "valles"])
  editorialImages[id] = {
    id: `place-${id}`,
    entityType: "entity",
    status: "approved",
    src: "/art/mars.svg",
    rights:
      "Original repository SVG; provenance recorded in the original editorial guide.",
    credit: "Tomorrow Times / Original Martian environment illustration",
    alt: "An illustrative Martian reservoir settlement, not a surveyed map.",
    crop: "landscape",
    focalPoint: [50, 50],
    reference: { canonIds: [id], approvedCharacterRefs: [] },
  };
export function resolveEditorialImage(id: string): EditorialImageRecord {
  return (
    editorialImages[id] || {
      id: `type-${id}`,
      entityType: "article",
      status: "placeholder",
      rights:
        "Original typography; no photographic or character reference claimed.",
      credit: "Tomorrow Times / Typographic editorial treatment",
      alt: "Typographic editorial treatment; commissioned scene pending.",
      crop: "landscape",
      focalPoint: [50, 50],
      reference: { canonIds: [], approvedCharacterRefs: [] },
    }
  );
}
