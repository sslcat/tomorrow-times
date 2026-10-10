import type { CanonEvent, Draft, Section } from '../lib/contracts';
type EventInput = [string,string,string,string,string,string[],string[],string[]];
const eventInputs: EventInput[] = [
 ['reserve-vote','The Commons defers the reserve vote','3026-10-09','ares','the-missing-reserve',['amara','ivo','soren','ines','water-board','helix'],['The assembly deferred the emergency water allocation vote for seventy-two hours.','The public ledger and contractor pump logs use different cut-off times.','A witnessed pressure test has been requested.'],['Ivo Sen alleges that the ledger overstates accessible reserves. Helix disputes that interpretation.']],
 ['log-release','The night-shift log enters the public record','3026-10-07','ares','the-missing-reserve',['soren','ari','water-board'],['The reservoir authority released one night-shift pressure log.','Soren Dax was placed on paid leave pending a safety review.'],[]],
 ['benefit-delay','The Ares relay benefit is postponed','3026-10-08','luna','a-room-for-lyra',['lyra','teo','mara','lantern-records'],['Lyra Saye postponed the Ares relay benefit.','Lantern Records confirmed that contracted stage crews will be paid.','No replacement date has been announced.'],[]],
 ['room-recording','Teo Voss releases a solo recording','3026-10-06','luna','a-room-for-lyra',['teo','lyra','lantern-records'],['Teo Voss released a solo recording made in a rehearsal room.','The recording credits no guest vocalist.'],[]],
 ['comets-saints','Comets defeat Saints in the opening fixture','3026-10-05','luna','the-long-season',['tavi','pema','sima','comets','saints'],['The Ceres Comets beat the Tranquility Saints 4–3.','The match result stands while a tether measurement is reviewed.'],[]],
 ['comets-ribbons','Comets and Ribbons share the points','3026-10-07','luna','the-long-season',['tavi','cato','comets','ribbons'],['The Ceres Comets and Red Ribbons drew 2–2.','Cato Bell scored the final equalizer.'],[]],
 ['saints-ribbons','Saints finish the opening round with a win','3026-10-09','luna','the-long-season',['pema','cato','saints','ribbons'],['The Tranquility Saints beat the Red Ribbons 3–1.','All three opening-round matches were played in the Tranquility cage.'],[]],
 ['cargo-hold','Dock service detains Pike’s freighter','3026-10-05','ceres','sealed-cargo',['nadi','oren','leena','customs','meridian'],['The Ceres Dock Service detained Oren Pike’s freighter over a disputed consignee entry.','Pike has not been charged with a crime.','The cargo includes temperature-sensitive medicine.'],['Investigators suspect a consignee entry was altered after loading; responsibility is not established.']],
 ['cargo-order','Dock court orders an independent inventory','3026-10-08','ceres','sealed-cargo',['nadi','oren','leena','customs'],['The dock court authorized an independent inventory of the detained cargo.','The order does not authorize release of the cargo.'],[]],
 ['signal-repeat','Pelagos reports a repeating acoustic pattern','3026-10-06','europa','under-the-ice',['esme','jun','mira','pelagos'],['Two Pelagos sensors recorded a repeating acoustic pattern.','The source of the pattern is unknown.','The team has made no claim of biological activity.'],[]],
 ['sensor-test','Pelagos begins an independent sensor comparison','3026-10-09','europa','under-the-ice',['esme','jun','mira','pelagos'],['Pelagos began a comparison using an independently calibrated sensor.','No ocean drilling or closer probe deployment has been approved.'],[]],
 ['daro-delay','The Daros’ transfer is delayed','3026-10-07','ceres','a-place-at-the-table',['hana','eli','noa','ada','bea'],['The Daro family’s departure to Ares is delayed.','Their housing approval remains conditional.','Noa’s school transfer portfolio is complete.'],[]],
 ['care-rota','Neighbors begin a care rota for Ada Daro','3026-10-09','ceres','a-place-at-the-table',['hana','ada','rue'],['Three neighboring households agreed to a weekly meal rota with Ada Daro.','Ada chose which days she wanted company.'],[]],
 ['freight-guarantee','Meridian offers an interim freight guarantee','3026-10-06','ceres','the-price-of-passage',['sol','ines','tamsin','meridian','helix','council'],['Meridian offered an interim guarantee for freight on the Mars corridor.','The offer does not cover passenger delay costs.','Helix retains the existing pump maintenance contract.'],[]],
 ['contract-hearing','The council requests corridor contract exclusions','3026-10-09','luna','the-price-of-passage',['tamsin','sol','ines','council','meridian','helix'],['The Common Reach Council requested publication of corridor contract exclusions before its hearing.','No replacement corridor contract has been awarded.'],[]],
 ['oven-trial','Valles authorizes a shared oven trial','3026-10-05','valles','small-common-things',['rafi','valles'],['Valles approved a four-week shared evening oven trial.','Participating stalls will share metered power costs.'],[]],
 ['river-path','Restoration board keeps the river path open','3026-10-08','earth','small-common-things',['nell','earth'],['The restoration board kept the river path open during reed planting.','Volunteers will mark temporary walking lanes.'],[]],
];
export const seedEvents: CanonEvent[] = eventInputs.map(([id,title,date,locationId,storylineId,participants,facts,allegations])=>({ id, fingerprint:id,title,date,locationId,jurisdiction:locationId,storylineId,participants,facts,allegations,causes:id==='reserve-vote'?['log-release']:id==='cargo-order'?['cargo-hold']:id==='sensor-test'?['signal-repeat']:[],effects:[],rules:{ftl:false} }));
seedEvents.find(e=>e.id==='comets-saints')!.effects = [{type:'fixture',fixtureId:'round1-comets-saints',home:'comets',away:'saints',homeScore:4,awayScore:3}];
seedEvents.find(e=>e.id==='comets-ribbons')!.effects = [{type:'fixture',fixtureId:'round1-comets-ribbons',home:'comets',away:'ribbons',homeScore:2,awayScore:2}];
seedEvents.find(e=>e.id==='saints-ribbons')!.effects = [{type:'fixture',fixtureId:'round1-saints-ribbons',home:'saints',away:'ribbons',homeScore:3,awayScore:1}];
type StoryInput = { id:string; title:string; dek:string; section:Section; event:string; author:string; art:Draft['art']; format?:Draft['format']; body:string[] };
const stories: StoryInput[] = [
 {id:'the-water-that-isnt-there',title:'The water is on the ledger. Is it in the reservoir?',dek:'Ares postpones a crucial allocation vote after a night-shift log raises an uncomfortable question about the city’s reserves.',section:'politics',event:'reserve-vote',author:'ari',art:'mars',format:'Investigation',body:[
  'By the time Amara Venn asked the assembly for seventy-two more hours, the public gallery had stopped arguing. People were doing arithmetic. A reserve that looked comfortable at the start of a shift looked different when the water inside maintenance pipes was counted separately.',
  'The assembly deferred the emergency water allocation vote for seventy-two hours. That gives the reservoir authority time to arrange a witnessed pressure test and gives Venn’s opponents a narrow opening to challenge the figures on which her proposal rests.',
  'The discrepancy begins with a clock. The authority’s public ledger closes before the contractor’s pump log. Water moving between the two readings may appear available before it can be drawn. Ivo Sen, the neighborhood delegate who sought the delay, alleges that the method overstates accessible reserves. Helix Waterworks disputes that interpretation and says water in a working system cannot be counted as if every pipe were a storage tank.',
  'Neither account establishes that water has disappeared. The documents establish something less dramatic and more useful: the two totals do not describe precisely the same moment. A comparison that ignores that difference cannot settle the argument.',
  'Soren Dax, the technician whose shift log helped expose the mismatch, remains on paid leave. The authority describes the leave as part of a safety review. It has not accused him of falsifying a reading. His colleagues have asked that one of their number attend the test.',
  'For households waiting on a new allocation, the distinction is immediate. A number on a council screen does not fill a kitchen tap. Venn must now demonstrate what the city can actually promise before asking residents to vote on who receives it.'
 ]},
 {id:'a-signal-without-a-name',title:'Under Europa’s ice, a rhythm. Above it, restraint.',dek:'Two instruments heard the same pattern. The scientists who found it are asking the public to wait for a third.',section:'science',event:'sensor-test',author:'kael',art:'signal',format:'Feature',body:[
  'Jun Wren carried the replacement sensor into the listening room in a padded lunch box. The institute has more elegant containers, but this one fitted the connector without bending it. On a table beside the receiver sat a handwritten instruction: check the clock first.',
  'Pelagos began a comparison using an independently calibrated sensor. The test follows a repeating acoustic pattern recorded by two instruments beneath the settlement’s ice anchors. The pattern is real as a recording. Its source is not yet known.',
  'Esmé Calder’s team is comparing time stamps, mounting vibrations and the station’s own machinery before offering an account of what happened outside the instruments. A shared power supply can make independent-looking devices agree. So can a common error in their clocks.',
  'The institute has made no claim of biological activity. Its charter officer, Mira-of-Nine, has also confirmed that no ocean drilling or closer probe deployment has been approved. Curiosity does not amend the noninterference charter.',
  'For Wren, the immediate question is smaller than the one arriving in messages from the inner system. If the spare sensor hears the interval without sharing the original mounting, one explanation becomes harder to sustain. If it does not, the team gains a different kind of result. Either will be worth the trouble of finding a better box.'
 ]},
 {id:'lyra-after-the-lights',title:'Lyra Saye is leaving the big room quiet',dek:'A postponed benefit, an unfinished partnership and the practical business of paying everyone who built the stage.',section:'entertainment',event:'benefit-delay',author:'dev',art:'stage',format:'Feature',body:[
  'The stage was ready before the announcement was. A row of empty coat hooks faced the rehearsal room, each labeled for a technician whose work had already been done. Lyra Saye’s postponement left the public asking about a relationship. The people in the room first asked about wages.',
  'Lantern Records confirmed that contracted stage crews will be paid. Producer Mara Isk says the cooperative contract covers completed preparation even when the performance does not take place. Refund information accompanies the postponement notice; a replacement date does not.',
  'Saye has not offered a public account of her working relationship with Teo Voss. Voss’s new solo recording contains no guest vocal and no statement about a separation. Turning an absent credit into a private confession would give a track list more authority than it has.',
  'The benefit was intended for Ares listeners, who would have received a delayed relay from Luna. A new date must make sense in both places, including for the crews whose shifts have already been rearranged once.',
  'It is possible to care about the songs and still read the small print. In this case, the small print means the people taking down the lights can afford to go home.'
 ]},
 {id:'a-captain-and-a-consignee',title:'A freighter waits. So does the medicine inside.',dek:'The case against a cargo manifest has consequences well beyond the captain’s cabin. No criminal charge has been filed.',section:'crime',event:'cargo-order',author:'ari',art:'cargo',format:'Report',body:[
  'The dock court authorized an independent inventory of the detained cargo. It is the first practical opening in a dispute that has kept Oren Pike’s freighter at Ceres while its cooling equipment runs on shore power.',
  'The order does not authorize release of the cargo. Inspectors must establish what is aboard and compare it with the sealed loading record. The contested entry names the intended recipient, a field with consequences for customs charges and medicine distribution.',
  'Investigator Nadi Rhee suspects the consignee was changed after loading. That remains an allegation under investigation; the court has not assigned responsibility and Pike has not been charged. His defender, Leena Moss, asked that the inventory preserve packaging temperatures as well as serial numbers.',
  'A medicine can remain evidence after it has ceased to be useful. That is the problem Moss wants the next hearing to address. The present order gives the court better information, but leaves the hardest decision on the dock.'
 ]},
 {id:'the-table-points-nobody-can-argue-with',title:'Three matches, one point between first and second',dek:'The opening round belongs to the Comets. The equipment argument belongs to everyone.',section:'sports',event:'saints-ribbons',author:'dev',art:'sport',format:'Analysis',body:[
  'The Tranquility Saints beat the Red Ribbons 3–1. The win leaves the Saints on three table points, behind the Ceres Comets on four and ahead of the Ribbons on one. Those figures do not depend on anyone’s opinion of the disputed tether.',
  'All three opening-round matches were played in the Tranquility cage. The Comets’ 4–3 win over the Saints and 2–2 draw with the Ribbons remain recorded results. Equipment referee Sima Ro’s review has not overturned either.',
  'Pema Das gave the Saints a calmer final sequence than they managed against the Comets. Cato Bell, whose equalizer rescued a point in the previous match, found fewer passing lanes against a keeper willing to wait.',
  'The traveling clubs will leave Luna with different concerns. The Saints have recovered a result. The Ribbons need a way to turn invention into possession. The Comets have a lead narrow enough to make every decision about Tavi Okoro’s workload look consequential.'
 ]},
 {id:'one-more-supper-on-ceres',title:'Before the Daros leave, there is still supper',dek:'A delayed transfer leaves a family between two homes. Around Ada Daro’s table, waiting becomes something they can share.',section:'local',event:'care-rota',author:'rue',art:'habitat',format:'Feature',body:[
  'Ada Daro objected to the first version of the rota because it gave her company on every evening. She wanted Thursday to herself. The second version left Thursday blank, and that was the one she signed.',
  'Three neighboring households agreed to a weekly meal rota with Ada Daro. Her daughter Hana is preparing to move to Ares with Eli and their child Noa, though the departure remains delayed and the housing approval conditional.',
  'A delayed move can look like extra time from the outside. Inside the flat, it means a cupboard half emptied, school papers in a sealed folder and a bean plant that keeps growing despite everyone’s inability to book it a place.',
  'Noa wants to know whether the plant is cargo or family. Eli says he is checking the rules. Hana says the plant can stay with Ada if it must. Ada says nobody has asked the plant.',
  'The rota does not resolve the housing queue or the departure date. It settles a question the neighbors can answer: who will bring a bowl, and when, and whether the person receiving it gets a choice.'
 ]},
 {id:'the-fine-print-of-passage',title:'Meridian’s guarantee ends where the passenger queue begins',dek:'The Mars corridor offer covers freight. Families delayed by the same ships will have to look elsewhere.',section:'business',event:'freight-guarantee',author:'ari',art:'cargo',format:'Analysis',body:[
  'Meridian offered an interim guarantee for freight on the Mars corridor. The proposal would protect specified commercial consignments against some costs of delayed sailings. It has been described in the corridor debate as a measure of confidence.',
  'The offer does not cover passenger delay costs. That exclusion matters because freight and families often depend on the same maintenance windows, fuel deliveries and ship departures. A cargo owner may have a claim while the mechanic traveling with a child does not.',
  'Sol Arendt’s company is competing for future corridor work, while Helix retains the existing pump maintenance contract. Neither position makes the guarantee a public rescue fund. It is a commercial offer with a defined customer.',
  'Council mediator Tamsin Quill is seeking the exclusions before the next hearing. Reading them will be less theatrical than comparing the bidders’ promises, and rather more useful to those deciding whether they can afford to travel.'
 ]},
 {id:'the-night-oven',title:'In Valles, the last loaf belongs to the late shift',dek:'A shared oven trial gives the evening market four weeks to prove that staying open can pay for itself.',section:'culture',event:'oven-trial',author:'rue',art:'habitat',format:'Feature',body:[
  'Rafi Nacre used to turn off the oven just as the transit cleaners passed his stall. They were finishing work when his customers had finished shopping. A hot loaf at that hour was a gift he could occasionally afford, not a business he could sustain.',
  'Valles approved a four-week shared evening oven trial. Participating stalls will share metered power costs. Nacre supplies the first warm chamber; two neighboring cooks supply food that can use the falling heat after his bread comes out.',
  'The agreement is deliberately ordinary. Each stall records the time it uses and what it sells. Unsold food does not become proof of civic virtue; it becomes something to adjust in the next evening’s plan.',
  'The trial will end with a ledger and a meeting. Until then, the cleaners have a place to sit where the shutters used to be.'
 ]},
 {id:'what-the-pressure-log-shows',title:'What the pressure log shows—and what it cannot',dek:'One released shift record narrows the reserve question. It does not settle it.',section:'investigations',event:'log-release',author:'ari',art:'mars',format:'Investigation',body:[
  'The reservoir authority released one night-shift pressure log. It records readings at the pump, not a direct measure of every chamber in the system. That distinction limits what can responsibly be claimed from the document.',
  'The log gives investigators a time series to compare with the public reserve ledger. It cannot, by itself, tell them how much water could be delivered to households at a particular minute. Valve positions and maintenance isolation also matter.',
  'The next useful record is the one that connects those states. Until it is available, both the accusation of a missing reserve and the assurance that every promised unit is available require more evidence.'
 ]},
 {id:'amara-venns-smallest-majority',title:'Amara Venn’s smallest majority may be her most important',dek:'The steward has bought time for a test, at the cost of making the test a public measure of her judgment.',section:'politics',event:'reserve-vote',author:'ari',art:'mars',format:'Analysis',body:[
  'The assembly deferred the emergency water allocation vote for seventy-two hours. For Amara Venn, the delay keeps a contested proposal alive. It also makes her next argument depend on evidence she does not fully control.',
  'Her position has two constituencies. Residents awaiting an allocation want a decision. Existing households want confidence that the new promise will not weaken the old one. Telling either group to trust the ledger has become politically expensive.',
  'Ivo Sen has gained a test, not a finding. If the accessible reserve matches the authority’s promise, he will have to explain what should change anyway. If it does not, Venn will have to explain why the assembly was asked to vote first.'
 ]},
 {id:'the-technician-on-leave',title:'The technician at the center of the ledger dispute is waiting too',dek:'Paid leave is a workplace status, not a finding of wrongdoing.',section:'local',event:'log-release',author:'rue',art:'mars',format:'Profile',body:[
  'Soren Dax was placed on paid leave pending a safety review. The authority has not announced a disciplinary finding. That leaves a night-shift technician in the peculiar position of seeing his work debated by people who do not share his shift.',
  'Dax’s public reputation was built on steadiness: readings taken on time, a handover that told the next crew what it needed to know. The released log has given those habits a political audience.',
  'The review should distinguish the condition of a pump from the conduct of the person who reported it. Until then, treating leave as proof of misconduct would put an allegation where a fact ought to be.'
 ]},
 {id:'a-public-test-needs-public-rules',title:'A public test needs rules published before the result',dek:'The assembly should decide what counts as accessible water before anyone reads the gauge.',section:'opinion',event:'reserve-vote',author:'ari',art:'mars',format:'Opinion',body:[
  'A witnessed pressure test has been requested. The word witnessed does useful political work, but a gallery of observers cannot rescue an undefined question. The assembly needs to specify what it is asking the test to measure.',
  'Accessible reserve should mean water that can reach users under an agreed operating condition. If one side includes isolated maintenance pipes and the other excludes them, a precise instrument will produce another imprecise argument.',
  'This is an editorial judgment, not an additional finding about the reservoir. Publish the definition, the cut-off time and the procedure first. Then let the reading surprise everyone equally.'
 ]},
 {id:'what-a-delay-sounds-like',title:'What a delayed relay sounds like from the other end',dek:'An Ares audience will hear Luna’s music later. Good billing should say so plainly.',section:'interplanetary',event:'benefit-delay',author:'dev',art:'stage',format:'Briefing',body:[
  'Lyra Saye postponed the Ares relay benefit. The canceled booking described a performance on Luna and a delayed transmission to Mars, a distinction that the replacement booking will need to preserve.',
  'No staging technique can remove the light delay between the worlds. The audience can share a song and a purpose without sharing the same instant. Calling both experiences live without naming the source time obscures what a ticket buys.',
  'That matters most when a performer appears to respond. A recorded pause is part of a recording. A new performance date should come with the same honest account of distance.'
 ]},
 {id:'teo-voss-room-tone',title:'Teo Voss lets the room take a verse',dek:'A spare solo release finds something worth hearing between the notes.',section:'entertainment',event:'room-recording',author:'dev',art:'stage',format:'Opinion',body:[
  'Teo Voss released a solo recording made in a rehearsal room. The room is audible: a chair moved too carefully, a breath before an entrance, the soft machinery that keeps any lunar room habitable.',
  'The recording credits no guest vocalist. Listeners hoping for a coded announcement about Lyra Saye will find a more interesting object if they allow it to be a piece of music. Voss has arranged the silences with the same care he gives the melody.',
  'This critic hears a work about attention, not an authorized account of a private relationship. The distinction leaves both the song and the people in it more room.'
 ]},
 {id:'the-crew-contract',title:'The clause that kept a canceled show from becoming unpaid work',dek:'Lantern’s cooperative agreement treats preparation as labor.',section:'business',event:'benefit-delay',author:'rue',art:'stage',format:'Report',body:[
  'Lantern Records confirmed that contracted stage crews will be paid. The commitment covers work already performed for the postponed Ares relay benefit, even though the audience has not heard a note.',
  'Producer Mara Isk’s problem is now one of timing and replacement bookings. The contract prevents that scheduling problem from becoming an argument over whether completed technical work has value.',
  'The distinction may sound obvious to anyone who carried a speaker. It has not always been obvious to the people who pay for one. A canceled show is an unusually clear test of what a cooperative means by shared risk.'
 ]},
 {id:'a-credit-is-not-a-confession',title:'A missing credit is not a confession',dek:'The private story readers want is not always the story a record can support.',section:'culture',event:'room-recording',author:'dev',art:'stage',format:'Analysis',body:[
  'The recording credits no guest vocalist. That is a fact about Teo Voss’s new release. It does not establish whom he is dating, whom he has forgiven or whether another collaboration is planned.',
  'Credits have become a convenient surface on which listeners arrange a narrative. Sometimes they reveal creative labor that deserved recognition. Sometimes they are asked to answer questions no participant has agreed to answer.',
  'A responsible account can follow the work and leave the private question unresolved. If the collaborators choose to speak, their words can enter the record then.'
 ]},
 {id:'four-three-and-a-loose-question',title:'Comets hold on, 4–3; the tether question stays open',dek:'The opening fixture delivers a narrow result and a separate equipment review.',section:'sports',event:'comets-saints',author:'dev',art:'sport',format:'Report',body:[
  'The Ceres Comets beat the Tranquility Saints 4–3. Tavi Okoro’s side leave the first fixture with three table points after a contest that gave neither bench a comfortable final minute.',
  'The match result stands while a tether measurement is reviewed. Pema Das asked for the inspection; referee Sima Ro will publish the measurement under the league equipment procedure. A request for review is not evidence that the match was invalid.',
  'The teams now have two records to consider: a score that counts and a technical question that deserves an answer. The second should not be used to erase the first before the inspection is complete.'
 ]},
 {id:'cato-bells-last-pass',title:'Cato Bell finds the equalizer, and a little patience',dek:'The Ribbons take their first point from a 2–2 draw with the Comets.',section:'sports',event:'comets-ribbons',author:'dev',art:'sport',format:'Report',body:[
  'The Ceres Comets and Red Ribbons drew 2–2. Cato Bell scored the final equalizer, giving the Ribbons a point and leaving the Comets with four after two fixtures.',
  'Bell’s reputation is for invention delivered at slightly greater speed than his teammates can always use. Here the last useful action was the one he waited to make. The space appeared after the first obvious pass had closed.',
  'One composed sequence does not remake a player. It does give the next training session a concrete example to return to, which is often more useful than a speech about maturity.'
 ]},
 {id:'how-the-table-is-counted',title:'How the Reach Six table is counted',dek:'Three points for a win, one for a draw, and no points awarded by applause.',section:'sports',event:'saints-ribbons',author:'dev',art:'sport',format:'Briefing',body:[
  'The Tranquility Saints beat the Red Ribbons 3–1. Combined with the first two fixtures, that puts the Comets on four points, the Saints on three and the Ribbons on one.',
  'Each win contributes three points; each draw contributes one to each side. Goal difference is goals scored minus goals conceded. The three clubs yet to play in this opening traveling round remain on zero.',
  'The published table is calculated from recorded fixtures. If a governing decision ever changes a result, that decision must be recorded as a correction, with the original result still visible in the audit history.'
 ]},
 {id:'safety-before-the-next-whistle',title:'The best time to explain a tether rule is before the next whistle',dek:'Equipment standards should be readable by the people asked to play inside them.',section:'opinion',event:'comets-saints',author:'dev',art:'sport',format:'Opinion',body:[
  'The match result stands while a tether measurement is reviewed. That is a reasonable distinction. It will remain reasonable only if the equipment review gives players something more useful than a statement that the procedure was followed.',
  'Sima Ro should publish the measured range, the permitted tolerance and the reason for that tolerance. A standard is a bargain about risk. The people inside the cage are entitled to understand the bargain.',
  'Changing a rule does not require pretending that everyone who followed the old one was negligent. It requires explaining what has been learned and when the new requirement takes effect.'
 ]},
 {id:'the-name-on-the-manifest',title:'Why the name on a cargo manifest matters',dek:'A consignee is more than a delivery address when medicines cross a jurisdiction.',section:'crime',event:'cargo-hold',author:'ari',art:'cargo',format:'Briefing',body:[
  'The Ceres Dock Service detained Oren Pike’s freighter over a disputed consignee entry. A consignee identifies the party entitled to receive the shipment and, in regulated cargo, the party responsible for its onward handling.',
  'An altered entry can change fees, licensing obligations and the route by which medicine reaches a clinic. It can also be an administrative correction. Inspectors need evidence of how and why a change occurred before assigning criminal intent.',
  'Pike has not been charged with a crime. Describing the vessel as detained reports a legal status; describing its captain as a smuggler would make a finding the court has not made.'
 ]},
 {id:'cold-storage-warm-arguments',title:'Cold storage makes the court’s clock tangible',dek:'An evidence dispute has a shelf life when the cargo is medicine.',section:'science',event:'cargo-hold',author:'kael',art:'cargo',format:'Analysis',body:[
  'The cargo includes temperature-sensitive medicine. Keeping it cold is not a single act performed at loading; it is a chain of logged conditions, power and equipment that must continue through every delay.',
  'A sealed package can preserve evidence while complicating inspection. Opening one can answer a customs question while changing what a pharmacist may later accept. The inventory protocol has to account for both interests.',
  'No public record yet establishes that this cargo has spoiled. The point of monitoring is to find out before a legal victory becomes a shipment nobody can safely use.'
 ]},
 {id:'leena-moss-keeps-two-lists',title:'Leena Moss keeps a list of questions the cargo cannot answer',dek:'The defender wants the court to distinguish the manifest, the medicine and the man.',section:'crime',event:'cargo-order',author:'rue',art:'cargo',format:'Profile',body:[
  'The dock court authorized an independent inventory of the detained cargo. For Leena Moss, the order is useful precisely because it answers a limited question: what is aboard the vessel and how it compares with the loading record.',
  'It does not establish who changed the consignee entry, whether the change was authorized or what Oren Pike knew. Those questions require evidence about people and decisions, not only containers.',
  'Moss’s insistence on separating the questions can sound slow in a port impatient to move. The alternative is quicker only if one is willing to mistake a complete inventory for a complete case.'
 ]},
 {id:'a-warrant-doesnt-travel-by-itself',title:'A warrant does not travel merely because a ship does',dek:'The Common Reach corridor is shared. Criminal jurisdiction is not.',section:'interplanetary',event:'cargo-hold',author:'ari',art:'cargo',format:'Briefing',body:[
  'Pike has not been charged with a crime. His ship’s detention on Ceres has nevertheless raised questions in other ports about what an eventual local order would mean for cargo or witnesses elsewhere.',
  'The Common Reach charter coordinates corridor access. It does not turn every dock inspector into an officer of every inhabited jurisdiction. Requests for evidence or enforcement must pass through the relevant local process.',
  'That can create delay, but it also creates a record of who asked for what authority. In a case built around a disputed document, the paperwork governing the investigation deserves scrutiny too.'
 ]},
 {id:'two-sensors-one-question',title:'Two sensors agreeing is a beginning',dek:'Shared clocks and shared mountings can produce shared mistakes.',section:'science',event:'signal-repeat',author:'kael',art:'signal',format:'Briefing',body:[
  'Two Pelagos sensors recorded a repeating acoustic pattern. Agreement makes the recording worth investigating; it does not make the instruments independent in every way that matters.',
  'The team is checking shared timing, station vibrations and common power paths. Each offers a possible route for one disturbance to appear in more than one channel. A comparison sensor must change enough of those conditions to be informative.',
  'The source of the pattern is unknown. That sentence marks the present boundary of the finding, and is the most useful sentence to keep beside any speculation about it.'
 ]},
 {id:'mira-and-the-unopened-door',title:'Mira-of-Nine’s job is to keep a tempting door closed',dek:'The charter officer at Pelagos is a person with a difficult brief, not a safety feature.',section:'science',event:'sensor-test',author:'kael',art:'signal',format:'Profile',body:[
  'No ocean drilling or closer probe deployment has been approved. Mira-of-Nine’s responsibility is to keep that boundary legible while the listening team investigates its new pattern.',
  'Mira is a machine person under the Sentient Labor Accord, with a legal continuity key and an employment obligation. Calling the charter officer an automated safeguard misses both the person and the possibility of principled disagreement.',
  'The charter can be reviewed through its agreed process. It cannot be suspended by the excitement of a discovery that has not yet been explained. Someone has to say that in a room full of people who want to go closer.'
 ]},
 {id:'the-apprentices-calibration',title:'A discovery still needs someone to check the connector',dek:'Jun Wren’s comparison test puts maintenance work in the foreground.',section:'local',event:'sensor-test',author:'rue',art:'signal',format:'Feature',body:[
  'Pelagos began a comparison using an independently calibrated sensor. Instrument apprentice Jun Wren is doing work that rarely appears in the first sentence of an exciting scientific story: checking a mount, tracing a cable and documenting a clock.',
  'Those tasks determine which explanations the eventual result can exclude. A sensor moved without recording how it moved may produce a new number and very little knowledge.',
  'Giving maintenance work a byline-sized share of attention would not diminish the finding. It would explain how a finding becomes something another person can trust.'
 ]},
 {id:'uncertainty-is-a-result',title:'Let an unexplained sound remain unexplained for a while',dek:'The ocean does not owe us a revelation on a publication schedule.',section:'opinion',event:'signal-repeat',author:'kael',art:'signal',format:'Opinion',body:[
  'The team has made no claim of biological activity. That restraint should be repeated as prominently as the existence of the acoustic pattern, because the two statements are part of the same report.',
  'An unexplained recording invites imaginative explanations. Imagination is useful for deciding what to test. It is less useful when the most appealing explanation is promoted to a discovery before competing accounts have been examined.',
  'If Pelagos eventually identifies a loose mount or an ordinary ice process, the work will still have improved the instruments and the record. A quieter answer can be a successful answer.'
 ]},
 {id:'the-bean-plant-question',title:'Is a bean plant luggage?',dek:'Noa Daro has a question for the adults planning a move between worlds.',section:'culture',event:'daro-delay',author:'rue',art:'habitat',format:'Feature',body:[
  'Noa’s school transfer portfolio is complete. It includes the observations from a classroom bean plant, which is now the subject of a separate family discussion about what can come to Ares.',
  'A school record fits in a message. A living plant needs a place, a container and clearance under the destination’s agricultural rules. The difference makes distance visible to a child more effectively than any diagram of the route.',
  'The family has not settled the plant’s itinerary. Ada Daro has offered a windowsill if it stays. Noa is considering whether regular measurements from a grandmother count as continuing the experiment.'
 ]},
 {id:'conditional-is-a-long-word',title:'“Conditional” is a long word when it describes your next home',dek:'The Daros’ housing offer survives for now. The uncertainty has a daily cost.',section:'local',event:'daro-delay',author:'rue',art:'mars',format:'Report',body:[
  'Their housing approval remains conditional. For Hana and Eli Daro, that means a prospective address on Ares is still tied to documentation and a departure they cannot yet complete.',
  'Registrar Bea Lin works within an allocation system intended to prevent empty rooms being held indefinitely while other families wait. The same rule can press hardest on households whose delay is outside their control.',
  'The family’s extension request will need a recorded answer. Until it has one, packing is a task that cannot quite be finished, and unpacking would feel like a decision nobody has made.'
 ]},
 {id:'ada-chooses-thursday',title:'Ada chooses Thursday',dek:'A neighborhood care plan improves when the person receiving care gets a pencil.',section:'culture',event:'care-rota',author:'rue',art:'habitat',format:'Briefing',body:[
  'Ada chose which days she wanted company. The meal rota arranged by three neighboring households leaves room for solitude as well as support while her family prepares to move.',
  'That small revision changed the tone of the arrangement. A timetable drawn around a person can feel like supervision. One drawn with her can become a useful agreement between neighbors.',
  'The rota can be changed again. The neighbors have made that explicit, which may be its most practical feature: a promise that can be revised is easier to accept than one that quietly becomes a debt.'
 ]},
 {id:'moving-at-the-speed-of-a-ship',title:'The school file has arrived. The pupil has not.',dek:'Messages and people cross the Common Reach on very different timetables.',section:'interplanetary',event:'daro-delay',author:'rue',art:'cargo',format:'Analysis',body:[
  'The Daro family’s departure to Ares is delayed. Noa’s completed school portfolio can travel by relay far ahead of the family, leaving administrators able to prepare for a child whose arrival they cannot yet date.',
  'This is a common shape of interplanetary life: an application reaches its destination in minutes or hours, while its subject needs a ship and weeks of travel. Institutions often process the first timetable more comfortably than the second.',
  'A transfer policy that recognizes both needs an answer for the interval. Otherwise a family can be present in every required database and absent from the place where those records are supposed to help.'
 ]},
 {id:'the-council-asks-for-the-exclusions',title:'Before the corridor promises, the council wants the exclusions',dek:'Tamsin Quill asks both bidders to show where their obligations end.',section:'politics',event:'contract-hearing',author:'ari',art:'cargo',format:'Report',body:[
  'The Common Reach Council requested publication of corridor contract exclusions before its hearing. Mediator Tamsin Quill is seeking a comparable account of the risks each bidder proposes to leave with passengers, public authorities or subcontractors.',
  'No replacement corridor contract has been awarded. Meridian’s interim freight offer and Helix’s current pump work remain distinct arrangements, despite their frequent appearance in the same political argument.',
  'Publishing exclusions would make the hearing less dependent on broad assurances. It would also let residents ask about a delayed ship without first translating the question into a bidder’s preferred category of risk.'
 ]},
 {id:'two-companies-one-pipe',title:'Two companies can compete and still need the same pipe',dek:'The rivalry between Helix and Meridian does not make their operations independent.',section:'business',event:'freight-guarantee',author:'ari',art:'mars',format:'Analysis',body:[
  'Helix retains the existing pump maintenance contract. Meridian’s corridor ambitions therefore depend, in part, on infrastructure operated by a rival. Winning a commercial argument would not remove that dependency.',
  'The relationship gives both companies an incentive to describe the other’s role as replaceable. Public planners need a more exact account of which parts can change hands, how long a transition takes and who maintains service during it.',
  'The question is not whether competition is good in the abstract. It is whether the contract names the people who will keep a particular pump working on the day the paperwork changes.'
 ]},
 {id:'rescue-is-not-a-ticket',title:'A right to rescue is not a ticket home',dek:'The corridor charter protects access to help. It does not pay every travel bill.',section:'interplanetary',event:'contract-hearing',author:'ari',art:'cargo',format:'Briefing',body:[
  'No replacement corridor contract has been awarded. As the council prepares its hearing, passenger groups are asking how a commercial guarantee relates to the older promise of rescue access.',
  'The Common Reach charter requires access for rescue operations. It does not make routine passage free or automatically compensate a traveler whose sailing is delayed. Those protections must be written into a separate agreement.',
  'Confusing the two can make a proposal sound kinder than it is. The hearing should identify each obligation by name and say who can enforce it.'
 ]},
 {id:'the-cost-of-waiting',title:'The cost of waiting should have a line in the contract',dek:'A corridor can be commercially efficient while making households absorb its uncertainty.',section:'opinion',event:'freight-guarantee',author:'rue',art:'cargo',format:'Opinion',body:[
  'The offer does not cover passenger delay costs. That exclusion is Meridian’s right to propose and the council’s responsibility to examine. It should not disappear behind the comforting word guarantee.',
  'Households pay for delay in temporary rooms, missed work and repeated school arrangements. Those costs remain real when no company is required to reimburse them. A public comparison of bids should count them somewhere.',
  'The council may decide that a broader guarantee costs too much. It should make that decision with the household cost visible, rather than achieve apparent economy by leaving it outside the calculation.'
 ]},
 {id:'the-path-through-the-reeds',title:'The new reeds will have to share the river',dek:'A restoration board keeps a walking route open through a planting project.',section:'local',event:'river-path',author:'rue',art:'habitat',format:'Report',body:[
  'The restoration board kept the river path open during reed planting. Gardener Nell Fenn’s volunteers will mark temporary walking lanes so the new beds can establish without closing the route residents use each evening.',
  'The decision accepts some inconvenience for both groups. Walkers must follow the temporary route; the planting team must work around a public that is sometimes inattentive and occasionally accompanied by an enthusiastic dog.',
  'Fenn says a restored river should have people beside it. The practical test is whether the marked lanes make that principle possible on an ordinary wet afternoon.'
 ]},
 {id:'the-oven-minutes',title:'The market’s newest currency is an oven minute',dek:'Valles cooks are discovering that a shared utility needs a shared vocabulary.',section:'oddities',event:'oven-trial',author:'dev',art:'habitat',format:'Briefing',body:[
  'Participating stalls will share metered power costs. The shared oven trial in Valles has consequently produced a lively distinction between a minute of full heat and a minute spent borrowing what is left.',
  'Rafi Nacre’s bread needs the hotter chamber. A neighboring cook can use the falling temperature afterward. Charging both uses as if they were identical would be simple, but it would not describe what either stall consumes.',
  'The trial ledger now has room for notes. For the moment, the most important technological improvement is a pencil tied to a string.'
 ]},
 {id:'a-public-garden-can-be-used',title:'A public garden is allowed to have footprints',dek:'Nell Fenn’s river path offers a modest argument for useful beauty.',section:'culture',event:'river-path',author:'dev',art:'habitat',format:'Opinion',body:[
  'Volunteers will mark temporary walking lanes. That sentence from the river restoration decision contains an aesthetic principle worth borrowing: a beautiful place can accommodate the people for whom it was made.',
  'There are good reasons to protect new planting. There are fewer good reasons to treat every human use of a restored landscape as damage. The marked lanes acknowledge both without asking one side to vanish.',
  'The result may look less immaculate in a project photograph. It may also be a place a resident can reach after supper, which is a different and more durable kind of success.'
 ]},
 {id:'four-weeks-to-keep-the-lights-on',title:'Four weeks to make an evening market last',dek:'The shared oven trial will be judged by costs, customers and the people doing the closing shift.',section:'business',event:'oven-trial',author:'rue',art:'habitat',format:'Analysis',body:[
  'Valles approved a four-week shared evening oven trial. A limited trial gives the market permission to discover that an appealing idea needs changes, without treating every adjustment as a political defeat.',
  'Sales and power use will be the obvious measures. Less obvious is who stays to clean, whether those hours are paid and whether late customers can afford the food. A busy stall can still depend on somebody quietly donating labor.',
  'At the review meeting, Rafi Nacre will need more than a photograph of a full table. He will need a model that lets the people serving it sit down occasionally too.'
 ]},
];
export const seedArticles: (Draft & { date:string })[] = stories.map(s=>{
 const e=seedEvents.find(e=>e.id===s.event)!;
 return { id:s.id,title:s.title,dek:s.dek,section:s.section,format:s.format||'Report',authorId:s.author,body:s.body,eventIds:[e.id],entityIds:[...new Set([...e.participants,e.locationId])],storylineId:e.storylineId,art:s.art,claims:[{eventId:e.id,fact:e.facts[0]}],date:e.date };
});
