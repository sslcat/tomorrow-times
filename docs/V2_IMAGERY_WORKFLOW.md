# Editorial image workflow — prepared, not connected

The typed manifest in `src/lib/editorial-images.ts` resolves by article, character or entity ID. It contains 92 assignments: six approved V2 article illustrations, two place assignments to original Mars artwork, pending character monograms and explicit typography fallbacks. `src/editorial/image-fallbacks.json` carries rights, credits, alt text, crop, focal point and canonical references for the original edition and cast. Arbitrary paths from articles never become image URLs. Only a reviewed manifest record with `approved` status and a local source path renders an image.

The six original V2 files under `public/art/v2/` are hand-authored SVG compositions, with no downloaded source material or generated faces: Afterlight (benefit stage), Room Tone (conceptual music), Crew (stage work), Europa (sensor concept), Cargo Hold (sealed cases), Cage (the canonical 4–3 match). They do not establish a venue floor plan, physical release format or photographic likeness. The original six SVGs remain available for existing links and provider compatibility. Visible labels distinguish illustrations and typography from documentary imagery. A shared Martian environment may illustrate Ares and Valles, explicitly not a surveyed map; it is not reused as a celebrity venue or unrelated planet.

Structured briefs: `src/editorial/image-briefs.json` contains **10 article briefs and 8 recurring-character briefs**, each with subject, composition, environment, lighting, wardrobe, factual constraints, ratios and mobile/desktop crop instructions. References, generation approval and review approval are empty/pending. Character face generation is explicitly blocked by the existing world bible until identity references are approved. Future fashion, residence, premiere and awards briefs require approved corresponding events and designs first; none currently exist, so no imaginary mansion or award night has been attached to the opening edition.

## Future authorized workflow

1. A trusted editor reads approved public canon and checks private constraints in the protected desk.
2. Save an immutable brief revision with source event IDs, identity references, crop needs and rights requirements. Missing character references block portrait generation.
3. Obtain explicit owner authorization for the provider and budget, including a zero-cost provider if any. The current architecture has **no connected generation MCP, API adapter, image generator, budget or billing capability**.
4. A future reviewed adapter would return a pending local candidate with provider/job ID, full prompt hash, reference IDs, terms/provenance, timestamp and actual cost. A generation response never approves itself.
5. An editor reviews face/wardrobe consistency, physical plausibility, licensing, claims, mobile crop and alt text. Reject or approve with reviewer identity and timestamp. Canon changes remain a separate workflow.
6. Add the approved local asset ID to the manifest, retaining the prior record in Git. Confirm no private reference, pending image or prompt enters public bundles. Capture mobile/desktop crops and rerun the imagery tests.

There is intentionally no executable bridge that could spend money. Generation and attachment are separate stages; an approved illustration does not become a canonical visual identity automatically. No paid generation or external image download occurred in V2.
