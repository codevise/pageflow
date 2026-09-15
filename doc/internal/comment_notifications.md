# Comment Notifications

Unread comment activity shows in the badges and activity list of the
scrolled review interface (`entry_types/scrolled/package/src/review/`)
and as a dot beside an entry in admin lists
(`Pageflow::EntryCommentSummary`). Treating every unseen event alike
is tolerable for a dot and far too noisy for mail, so a second grade
sits on top of unread: whether the activity *notifies* the user, which
the prominent indicators and the digest mail follow.

This page holds what the code that grades that activity cannot say:
the vocabulary, the options rejected on the way, the absences that are
deliberate and the traps. For how any of it works, read the code.

Notifying layers on `isUnread` in
`entry_types/scrolled/package/src/review/unreadActivity.js` and its
counterpart in `Pageflow::EntryCommentSummary`; it does not replace
it.

## Terminology

- **Unread / notifying** — two independent facts about an event.
  Unread is whether the user has seen it, and owes nothing to the
  settings. Notifying is whether the levels and overrides say to tell
  them about it. Three states are reachable, since activity the user
  has already seen notifies nobody. The badges and the activity list
  show unread activity whatever the level says; the prominent
  indicator and the mail follow notifying. Muting a thread therefore
  keeps showing its unread activity and stops notifying about it.
  Slack shows the same split as a bold channel name against a red
  count pill; Matrix calls the two `notify` and `highlight`.
- **Participation** — the user authored a comment in the thread.
- **Level** — whether participation is required before activity
  notifies: `all_activity`, `participating_threads`, `muted`.
- **Bucket** — how a user reaches an entry: `assigned` if they have a
  `Pageflow::Membership` on the entry itself, `other` if they only
  reach it through their account role. Defaults are per bucket.
- **Watermark** — the point up to which an entry's activity has been
  *considered* for notification. One per entry, not one per user: what
  an entry still owes does not depend on who reads it. Not read state;
  both filter a digest.
- **Horizon** — how far back a sweep looks at all. Configured rather
  than stored, and every window is clamped to it.
- **Interval** — whether mail is how a user hears about what notifies
  them: `continuous` or `never`, per user and account.

## The levels

`all_activity` rather than `watch` because the other values are named
for what they include, and because the two words do different jobs:
"Watch this story" is the button, `all_activity` is what it writes.
GitHub splits them the same way, and Slack's setting reads "All new
messages", never "watch". Spelled out rather than a bare `all`, which
as a Rails enum value generates a scope colliding with `Model.all`.

The interval is a second axis rather than a fifth value here. `muted`
says nothing in this scope is worth telling me about, wherever it is
shown; an interval of `never` says mail is not how I want to hear
about what is. Collapsing them would make turning mail off also dim
the indicators.

Thread scope needs no `participating_*` value at all: `all_activity`
on a thread is "treat me as a participant in this thread", and `muted`
silences it even where the user did participate.

Resolutions get no special case — a resolution in a thread the user is
in notifies, like anything else there.

## Resolving a level

Only explicit human decisions are stored. Every other rung is derived
on read, so adding or removing an entry membership changes a user's
default immediately and without a backfill, while an override they set
themselves survives it.

An account that wants everybody told about everything sets the `other`
default to `all_activity`; hosted Pageflow seeds that for the manager
who registers the account.

## Delivery

Nothing is enqueued when a comment is written: whether to send can
only be decided against read state as it stands at send time, which
is a sweep's job and not a controller's. Each mail job rebuilds its
digest then, so a level changed or a thread read since the activity
happened still counts.

Delivery is at least once, not exactly once. Enqueueing cannot be
atomic with moving a watermark, so a process dying between them
repeats what it had already enqueued for that entry.

### One mail per entry

A digest covers one entry so that a threading mail client can collect
a story's mail into one conversation.

The cost is volume — somebody active in eight stories gets eight mails
where one would have done. It buys a subject that says what the mail
is about, a conversation per story, and the ability to mute a story in
the mail client the way the entry level mutes it here. Threads within
one story still mix, which grouping by thread in the body carries:
"3 new replies in ⟨topic⟩" is one line, not three.

### Holding an entry until it falls quiet

An entry whose activity has not stopped is held rather than swept, or
a review pass spanning three sweeps arrives as three fragments. Note
who that lands on — a reviewer's own writing never notifies the
reviewer, so the fragments go to whoever is watching the story.

This is what lets the sweep run often. Latency is the quiet period's
to decide rather than the schedule's: sweeping every few minutes makes
a calm story's mail prompt without splitting a busy one.

resque-scheduler is already part of the install generator
(`lib/generators/pageflow/resque/`); the host app schedules the sweep.

## Recipients

Drive the sweep from activity, never from users, and the notified set
stays small and directly queryable. Nobody reaches a digest without
an entry membership, an explicit override, an account default of
`all_activity`, or a comment of their own in the entry. Full reader
expansion happens only by explicit opt-in and is bounded by how many
people asked for it. That is a property of narrow defaults worth
keeping.

## Storage

Explicit decisions only, and the four rungs do not share a key shape,
so they do not share a table.

The two default rungs carry the same pair of columns,
`assigned_entries_notification_level` and
`other_entries_notification_level`, so the fallback between them reads
as the same two fields at two rungs. Buckets are columns rather than
rows: there are exactly two, they follow from the authorization model
rather than from data, and it leaves both unique indexes a simple key.
The columns name what they govern because a settings table can grow a
comment setting that is not about notification; an override row needs
only `level`, because its model name already says the rest.

The account's defaults get a table rather than columns on
`pageflow_accounts`. There they would need a prefix to stay legible —
`default_assigned_entries_comment_level` — and a name that long is
telling you the column is in the wrong table. `EntryTemplate` is the
precedent: account scoped defaults live in a satellite rather than
widening the accounts table.

The two override rungs do share a shape, and would merge into one
table if `comment_thread_perma_id = 0` meant "the entry itself".
Perma ids start at 1, so it works, but every query then carries a
magic number and the column sometimes names no thread. Two narrow
tables cost less.

A watermark has no row until its entry has been swept, and the horizon
stands in meanwhile — the same shape as a missing `CommentThreadRead`.
That is why there is no backfill, and why an installation's first
sweep mails the last horizon's worth of genuinely unread activity
rather than nothing.

Not per user, because whether an entry still owes a digest does not
depend on who reads it: every recipient of an entry shares its window.
A second cadence is the one thing that would change that, and the one
thing that would put `user_id` in this key.

Not a single row for the whole installation either. One boundary
cannot advance past a held entry without repeating a swept one, and
holding it back for the held entry repeats every other entry instead.

Both settings tables also carry `digest_interval` — the same column at
two rungs, like the two level columns, so that "this account sends no
comment mail" and "send me none from this account" read as one
setting decided twice.

## Naming

A thread is the conversation; a topic is its first comment. Code and
translation keys say *thread* for anything covering the whole
conversation, and only translation values say "topic", which is the
word the interface has always used. `:topic` survives as an event
kind, where it does mean the first comment specifically, alongside
`:reply` and `:resolution`.

## Where the controls live

Each scope's control lives where that scope is the subject.

- **Thread level** — the three dot menu on a thread's first comment.
  It has to render there whoever wrote that comment, since muting is
  something one does to other people's threads, and `Thread.js` owns
  its items: once the menu carries a thread action it is the thread
  menu rather than a comment menu.
- **Entry level** — a drop down, first of the action items on the
  entry's admin page, where every other decision about that entry
  already sits. Each item carries a line saying what it covers, and
  the default item names the level it falls back to and the bucket
  that picked it, so leaving the decision to the settings is as
  legible as making one here. The button shows the level the entry
  resolves to.
- **Account defaults** — the account's own on its admin page, manager
  editable, and a user's own within that account on a notifications
  page of its own. Two pages because they are two different things:
  on one, only a manager could set them, and then for everybody. The
  interval sits beside the levels at both rungs, being the same
  decision about the same account.

The entry list shows the level a user stored for a row next to its
count, never the resolved one, which would put a bell on every row and
say nothing. Muting an entry keeps its dot and stops it notifying, so
the column stays a map of where the noise is and says where it was
turned off.

## Roads not taken

### Notifying from the controllers

`Review::CommentsController#create` looks like the obvious seam, but
the send decision cannot be made when a comment is written: mail is
batched, and it has to be re-filtered against read state at send time.
A per-event trigger means enqueueing a job per recipient and then
debouncing it, and cancelling or recomputing it when the comment is
edited or somebody mutes the thread afterwards. The sweep needs none
of that, and `EntryCommentSummary.for_entries` is most of its query
already.

### Materialising notification rows when a comment is created

One row per user and event at creation time would remove the
duplicated notification rule and give an audit trail. It needs
invalidation on every level change — muting a thread has to retract
pending rows — plus a backfill. Deriving instead pays a second
implementation, a cost the codebase already carries for `isUnread`.

### A delivered mark per recipient

A row per user recording how far their digest has been delivered would
make the sweep resumable and delivery exactly once. It is not: a crash
between sending and updating the mark repeats that user's digest all
the same. One job per recipient narrows the same window for no schema,
and the mark composes on top of it later if a duplicate ever costs
more than an extra mail.

Nor does moving the entry watermark on delivery success give retry for
free, which is the shape the idea usually takes. The sweep finds work
by looking for activity, so an entry with nothing new is never
reconsidered and the failed recipient never comes up again. Making the
sweep see them means holding the horizon open behind every failure,
where one dead mailbox pins it forever. Queue level retry on the mail
job costs two lines and backs off properly. What it does not do is
close the hole: after the last attempt that activity is lost for that
user, silently, and only the mark would fix that.

### A stored boundary for the sweep as a whole

The sweep kept a single row saying how far it had considered activity,
which the per entry watermarks replaced. It looked load bearing for a
while, on the grounds that one row is also the record that the sweep
ran, and that a bound derived as "the last N hours" skips whatever an
outage pushed out of reach.

The watermarks are that record already: a sweep that does not run
advances none of them, so every entry's next window still starts where
it did. What is left is the horizon, and what it drops it drops on
purpose — an outage longer than the horizon means those digests are
not sent. A stored boundary would mail all of it at once instead,
which is the failure the row seeded at install was there to prevent.

### A digest interval of daily or weekly

Two problems, neither of them about the enum. A schedule needs a send
hour and a timezone, and a user has a locale, not a zone; without one,
"daily" means twenty four hours after the last one and settles on
whatever hour it started at. And the horizon has to reach back at
least a cadence, so a weekly bucket makes every sweep scan a week.

They would also force the watermark per user: two recipients of one
entry on different cadences no longer share a window. Bucketing by
cadence rather than by user only moves that to the moment somebody
switches bucket, where they skip whatever their old one had not sent
yet.

`continuous` and `never` need none of it. `never` has no bucket, so
one cadence is ever live and the watermark stays keyed on the entry.

### A fast lane for replies to threads I am in

A reply addressed to you is the one thing a digest feels slow for. But
a quicker second lane has to flush the rest of the digest along with
it, or the reply arrives without the topics opened before it and reads
as an answer to a conversation the user was never told had started.
Once it flushes everything it is not a lane, it is a trigger that ends
the quiet period early — and it fires exactly when somebody is working
through your story replying to your threads, which is the pass the
quiet period exists to collapse.

If reply latency ever has to be shorter, it is a shorter quiet period
when the pending digest holds a reply, not a second mail.

### A level for "new topics, but only replies in my threads"

Tempting in an entry with many commenters, and the only candidate
level whose unit of notification is the event rather than the thread.
It delivers half a conversation: the user is told a question was asked
and never told it was answered. Every other level gives whole threads,
just fewer of them. The volume it was meant to address belongs to
digest grouping and to stepping down the ladder.

### A level above `all_activity` for a full audit log

"Everything, everywhere" is already expressible as an account default
of `all_activity` for the `other` bucket; nothing sits above the top
of the
ladder. The real gap is a surface — `ActivityList` is per entry,
admin lists only show dots — and a settings entry is the wrong place to
compensate for a missing cross-entry feed.

### A default that depends on how many people are in the entry

"When I am the only other user, watch everything" is right about the
intent and wrong as a mechanism. An indicator whose meaning changes
when somebody is added to the entry cannot be explained. The account
default for the `other` bucket serves the small shop deliberately
instead.

### Requiring an entry membership to opt in

Membership is authorization. Everything a user might want is reachable
without touching it: everything in an account through their account
default, everything in one story through an entry override, less on a
story they are assigned to through the same override. Membership is
read only as a *prior* for a default. Where the account role already
grants access, the row's only information is "this story is yours".

### Storing the per-account default on `Membership`

`account_membership_exists` guarantees exactly one account membership
per user and account, so the row already exists and none would ever
have to be created for notifications — which does meet the objection
above. It still writes a preference into the authorization table,
against the same line, and it ties that preference's lifetime to
access: revoke and re-grant, and the user silently loses their
settings.

### Auto-watching an entry on first comment

Writing an entry override the first time a user comments would let a
drive-by comment commit the user silently, and it reintroduces a write
triggered by a domain event. See below for why deriving the same thing
fared no better.

### A level for every thread in entries the user commented in

`participating_entries` shipped as the `other` bucket default, so that
editors who reach entries through an account role rather than an entry
membership would follow the stories they had touched. It was dropped
before release.

Commenting in a thread says something about that thread and little
about the other forty in a long story, so the level extrapolated from
a signal that did not carry it: one typo correction subscribed a user
to everything that followed. GitHub subscribes at issue scope for the
same reason and keeps repository watching explicit.

It was also the only level whose meaning depended on data rather than
on the level itself, and every surface that showed a resolved level
had to deal with that. The entry drop down could not say what the
level would do without querying for the user's comments, "nothing yet"
read as a mute, and the honest name for it did not fit on one line.

Removing it collapses participation from three values to a boolean,
which takes a data dependency out of the client: `notifications.js`
had to load every thread of the entry just to decide whether the user
had commented somewhere in it.

What it was for stays reachable. Unread and notifying are independent,
so the entry list dot and the badges still show activity in stories a
user can reach, whatever their level says; being *told* is what now
takes a deliberate entry override, or an account default of
`all_activity` for the `other` bucket.

### A user-global default beside the per-account one

Every case we could name is covered by the per-account rung falling
back to the account's own default, and most users belong to one or two
accounts, where "my settings for this account" simply reads as "my
settings". A global rung can be added below later. Settings are hard
to remove.

### The entry level in the review sidebar, or on the entry list

The sidebar is the wrong moment: annoyance arrives with a digest or
with a column of dots, not while reading one story. It would also need
chrome that does not exist — `ThreadList` has a container and a new
topic button, `ActivityList` only day headings.

The entry list was built first, as a drop down on the comment
indicator: that list is the only view putting several stories'
activity side by side, and choosing a level is a comparative
judgement. It reads as a setting hidden inside an indicator. The
indicator has to render for entries without comments to be a control
at all, the tooltip has to move into the panel because a drop down
cannot share the hover affordance, and a row of a table is a cramped
place for four options that each need a line of explanation. The list
keeps the comparison by showing what was chosen; the choosing happens
where the entry is the subject.

### A polymorphic subject for override rows

`CommentThread` already addresses sections and content elements
through `subject_type` and `subject_id`, so one override table with a
polymorphic subject looks like the same move. It is not. Those
subjects have single-column ids within a revision, while a comment
thread is identified by entry and perma id together, and a
polymorphic pair cannot hold the key that matters most here. The
default rungs do not fit either: they hold two levels, one per
bucket, where a subject row holds one. Merging anyway means a
nullable `bucket` and a nullable `user_id`, and on MySQL a unique
index cannot police those — NULLs compare as distinct, so nothing
would stop two rows claiming to be the same account's default.

### Folding overrides into `CommentThreadRead`

That table is already `(entry, user, perma_id)` and a `level` column
would fit. Read marks and overrides have different lifecycles: an
override can exist without a read, which makes `read_at` nullable and
complicates the upsert in `CommentThreadRead.mark`.

## Deliberate absences

- **Mentions.** They will pierce `muted`, which is why they need no
  level of their own, and why the level is `muted` rather than
  `ignored` — once mentions exist, "muted" is still true.
- **A cross-entry activity feed.** Out of scope, but the model is
  shaped not to foreclose it: because unread is tracked apart from
  notifying, such a feed is a rendering job later rather than a
  re-derivation.
- **Immediate mail.** Everything is a digest. Whoever wants to know at
  once has the review interface.
- **Involvement through editing.** Participation means commenting.
  Counting revision authorship or an edit lock would widen it, and is
  the obvious move if the bootstrapping trap below turns out to bite.

## Traps

- **The notification rule lives in Ruby and in JavaScript.** So does
  `isUnread` already, with "kept in sync" comments on both sides. At
  three coupled rules that stops being enough: give both sides one
  shared fixture file of cases — level, participation, event kind and
  read state against both expected answers — and have both suites
  read it.
- **Unread and notifying are separate facts.** Collapsed into one
  value, unread activity cannot later feed a view that shows
  everything with the notifying subset emphasised.
- **The watermark is not read state.** It records what has been
  considered, not what has been seen, and not what has been delivered.
  Both filter the digest, and an entry's watermark moves when the
  entry is swept whether or not that produced a single mail.
- **The digest subject carries no count.** Gmail groups on subject as
  well as on `References`, so a subject that changed from one send to
  the next would break the story's thread every time.
- **The maximum hold has to stay below the horizon.** Two config
  values with nothing relating them, and a hold that outlasts the
  horizon silently truncates the burst it was holding.
- **Thread rows key on perma id.** Comment threads are copied to new
  revisions, so an override keyed on `comment_thread_id` is lost on
  the next copy, exactly as a read mark would be.
- **The `other` bucket default is inert for account role `member`.**
  Those users reach no entries through their account role, so the
  setting applies to nothing. Do not show it to them.
- **Resolving a level per row would undo the batch.**
  `EntryCommentSummary.for_entries` exists so that rendering a list
  does not query per row. The entry list needs each row's level as
  well, which takes this user's entry overrides, their entry
  memberships, their account default and the account's — all for the
  whole page at once, never a call per row.
- **A new thread notifies nobody by default.** Shipped defaults tell
  entry members about everything and everybody else only about threads
  they are already in, so the first thread in an entry reaches no one
  else until somebody watches the entry or the account raises its
  `other` default. The dot in the entry list is what carries it
  meanwhile.
