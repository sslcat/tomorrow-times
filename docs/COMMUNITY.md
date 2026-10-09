# Community

The reader’s table is for real readers talking about published fictional journalism. Fan theories and interpretation never update canonical world records.

## Offline experience

`/community` lists official article discussions with Politics, Entertainment, Sports, Science, Local, General and Crime filters. Other editorial sections remain discoverable in All rooms and from their articles. Recent activity, newest and most-comments sorts use stored timestamps and actual visible comment counts. Pages contain twelve discussions; thread pages contain thirty comments. Source articles, entity news histories and storyline reporting connect to those threads. Empty states explicitly state that this is a read-only demonstration.

There are no seeded users, posts, comments, reactions or artificial popularity. General has an honest empty state. It can receive linked reader topics after a verified write adapter and taxonomy policy are added. The launch seed creates forty official threads. Publication creates its thread in the same transaction, under a partial unique index. Repeated publication or thread creation cannot duplicate it.

## Data and service contract

- `users`: internal stable ID, display name, verified flag, reader/moderator role, suspension state.
- `threads`: published article source, optional real author, official flag, title, section, created/activity timestamps, hidden state.
- `comments`: author, thread, optional parent in the same thread, plain text, spoiler flag, hidden state and timestamp.
- `reactions` and `thread_follows`: unique per reader and target.
- `reports`: reporter, comment, reason, unique reporter/comment pair and queue status.
- `rate_limits`: durable per-action windows. `audits`: report and moderation decisions.

Only a trusted server-side verified session adapter may supply a reader ID to the service functions. Client request fields are not authentication. The public route remains closed with HTTP 403; it does not expose these methods.

Topics require a published source article. Comments and replies require a visible thread whose source is currently published. A reply parent must belong to that thread. Input is trimmed, size limited and stored literally; React escapes it when displayed. Spoilers render in native `<details>`; profile previews omit spoiler comments. Reader history shows only active verified reader profiles and comments in visible published discussions.

Actual popularity is currently visible comment count, with activity and stable ID tie-breaks. Reactions are implemented as unique internal service rows for future UI integration. Page-offset pagination has bounded page values and indexed ordering; a high-volume release should use keyset cursors and materialized counters.

## Moderation

Verified moderators can hide or restore a comment, suspend or restore an account, and resolve a report. Each decision requires a reason and writes an audit. Suspended users cannot perform new actions. Hiding a comment removes it from counts and reaction/report eligibility. Existing comments by a suspended account remain visible unless explicitly moderated.

The authenticated local editor can inspect the real report queue and use the moderation foundation. It creates a local moderator identity only when performing a moderation action, never as a pretend reader. Empty queues are not populated with demo abuse.

## Tests and launch blockers

Automated tests cover anonymous/unverified/suspended access, moderator permission, input bounds, wrong-thread replies, unpublished-content isolation, report deduplication, durable rate limits, hide/restore audit, reaction counts and official-thread idempotency. Browser tests verify the read-only message and blocked public writes.

Public identity, reader composer/reaction/report/follow UI, notification delivery, spam detection, moderator staffing, account recovery, privacy workflows, distributed controls and operational monitoring remain launch work. Do not enable public posting until authentication, authorization, moderation and abuse controls have been independently verified. Public reader actions cannot be enabled by an environment flag in this release.
