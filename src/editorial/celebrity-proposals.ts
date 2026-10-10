/** Private editorial proposals. Imported only by local staging and the protected draft workflow. */
import type { CanonEvent, Draft, Storyline } from "../lib/contracts";
export type CelebrityProposal = {
  storyline: Storyline;
  event: CanonEvent;
  draft: Draft;
  followThrough: string[];
};
const proposals = [
  {
    key: "lyra-listening-room",
    title: "Lyra’s small-room return",
    people: ["lyra", "teo", "lantern-records"],
    summary:
      "Lyra considers a smaller way to return to an audience after the postponed benefit.",
    eventTitle:
      "Lyra Saye announces a local listening session with a no-recording request",
    cause: "benefit-delay",
    facts: [
      "Lyra Saye announced a small listening session on Luna with a request that attendees put recording devices away.",
      "The session does not replace the postponed Ares relay benefit, which still has no new date.",
      "Teo Voss is not announced as a performer at the session.",
    ],
    headline:
      "Lyra Saye’s next room is smaller — and she wants the recorders off",
    dek: "A proposed local listening session gives the singer a route back to an audience without setting a new date for the Ares benefit.",
    paragraphs: [
      "The announcement would make a distinction that matters to ticket holders: a local session on Luna is not the delayed benefit promised to Ares listeners. The benefit still needs its own replacement booking.",
      "Asking people to put recorders away is also a request for trust. The next report should establish how the room handles that request and whether listeners can enjoy the music without turning every pause into a public clue.",
      "Teo Voss is not named as a performer. That says who is on this announcement; it does not establish a romantic history or a private split.",
    ],
    next: [
      "Review the published recording policy and access arrangements.",
      "Report the session only after its event is approved.",
      "Return to the outstanding Ares benefit booking; do not let a local triumph erase that obligation.",
    ],
  },
  {
    key: "teo-open-studio",
    title: "Teo’s room becomes the instrument",
    people: ["teo", "lyra", "lantern-records"],
    summary:
      "Teo’s solo release opens a dispute about what listeners hear as a flaw and artists hear as music.",
    eventTitle:
      "Teo Voss releases an annotated studio clip explaining the chair sound in his recording",
    cause: "room-recording",
    facts: [
      "Teo Voss released an annotated clip identifying a chair scrape retained in his solo room recording.",
      "Voss stated that the sound was kept intentionally.",
      "The clip makes no statement about a private relationship with Lyra Saye.",
    ],
    headline: "That chair scrape on Teo Voss’s record? He kept it on purpose.",
    dek: "An annotated studio clip would let the sound artist explain a tiny creative choice that survives a very close listen.",
    paragraphs: [
      "The original recording already contains the sound of a chair, a breath and the machinery of a habitable lunar room. The new clip would put one of those choices in Voss’s own public account rather than leaving the critic to guess.",
      "A small sound can carry a large argument about polish. The useful next question is what the artist wants listeners to notice, not whether the noise can be decoded into a private confession.",
      "The clip says nothing about a relationship with Lyra Saye. A studio explanation should be allowed to remain a studio explanation.",
    ],
    next: [
      "Invite a reviewed interview about the recording method.",
      "Develop an authorized studio visit with architectural references still pending.",
      "Follow the next release and credit collaborators by their documented contributions.",
    ],
  },
  {
    key: "mara-crew-credit",
    title: "Mara’s names behind the lights",
    people: ["mara", "lyra", "lantern-records"],
    summary:
      "A producer’s wages promise develops into an argument about who is visible when a star gets the headline.",
    eventTitle:
      "Mara Isk publishes a stage-credit policy after the postponed Ares benefit",
    cause: "benefit-delay",
    facts: [
      "Mara Isk published a Lantern Records proposal to place contracted stage-crew credits alongside performer credits on future benefit notices.",
      "The proposed policy is open for cooperative review and has not been adopted.",
      "The existing promise to pay contracted crews for the postponed benefit remains in place.",
    ],
    headline: "Mara Isk wants the crew’s names beside the star’s",
    dek: "A proposed Lantern Records credit policy would put the workers who build a benefit on its announcement, with cooperative approval still to come.",
    paragraphs: [
      "Isk’s proposal would extend a discussion that began with wages. Lantern Records has already confirmed that contracted crews will be paid for the postponed Ares benefit; adding their names to the notice asks a different question about recognition.",
      "The cooperative has not adopted the proposal. The next report needs a recorded response, including whether workers want public credits and how the policy would respect those who decline them.",
      "A billing rule will not set a replacement performance date. The crew-pay promise and the unresolved benefit booking remain separate obligations.",
    ],
    next: [
      "Seek a recorded cooperative response and consent policy.",
      "Follow a vote through the event approval workflow.",
      "If adopted, compare a subsequent benefit notice against the actual approved policy.",
    ],
  },
];
export const celebrityProposals: CelebrityProposal[] = proposals.map((p) => {
  const id = `v2-${p.key}-proposal`;
  const event: CanonEvent = {
    id,
    fingerprint: id,
    title: p.eventTitle,
    date: "3026-10-10",
    locationId: p.key === "mara-crew-credit" ? "titan" : "luna",
    jurisdiction: p.key === "mara-crew-credit" ? "titan" : "luna",
    participants: p.people,
    storylineId: p.key,
    causes: [p.cause],
    facts: p.facts,
    allegations: [],
    effects: [],
    rules: { ftl: false },
  };
  return {
    storyline: {
      id: p.key,
      title: p.title,
      summary: p.summary,
      status: "Proposed",
      participants: p.people,
      facts: [],
      questions: ["What will the participants put on the public record next?"],
      next: p.next,
      resolution:
        "A published follow-up records the outcome and its consequences.",
    },
    event,
    draft: {
      id: `${id}-report`,
      title: p.headline,
      dek: p.dek.replace("proposed ", ""),
      section: "entertainment",
      format: p.key === "teo-open-studio" ? "Feature" : "Report",
      authorId: "dev",
      body: [p.facts[0], ...p.paragraphs],
      eventIds: [id],
      entityIds: [...p.people, event.locationId],
      storylineId: p.key,
      art: "stage",
      claims: p.facts.map((fact) => ({ eventId: id, fact })),
    },
    followThrough: p.next,
  };
});
