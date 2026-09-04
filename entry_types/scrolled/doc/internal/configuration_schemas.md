# Configuration Schemas

Content element, section and widget configurations are stored as JSON
blobs. The schemas in `package/src/contentElements/<type>/schema.json`
and `package/src/frontend/schemas/` describe them a second time, so
that Ruby and the frontend can read a configuration without going
through the editor.

This page records why that second description exists, what was
rejected on the way and which absences are deliberate. The mechanism
itself reads better in the code - start from `x-fileCollection` in any
schema file and follow the terms below through both languages.

## Terminology

- **Subject** — what a schema describes, as `{model, typeName}`:
  `{model: 'contentElement', typeName: 'hotspots'}`, or type free as
  `{model: 'section'}` and `{model: 'entry'}`. Declared as `x-subject`.
- **File reference location** — a place in a configuration where a file
  *can* be referenced. Declared by `x-fileCollection`, flattened by
  `FileReferenceLocations` and shipped in the entry seed as
  `fileReferenceLocations`.
- **File reference** — a location resolved against actual configuration
  data, as `{subject, path, active}`. Produced by
  `collectFileReferences`, indexed by file by
  `collectEntryFileReferences`.
- **Referenced file** — a file some configuration points at. Not the
  same as a *used* file, see below.
- **Configuration place** — the editor's presentation of a reference,
  as `{label, detail, pictogram, select}`. Built by
  `getConfigurationPlace(path)` on the referencing model.
- **Active** — whether a reference takes effect, per `x-activeIf`.
  Credits filter on it, "is this file referenced at all" ignores it,
  and cleanup must not let an inactive reference veto a delete.

## Roads not taken

### Deriving the schema from the editor DSL

Introspecting `configurationEditor` with a recording receiver and
collecting the `input` calls would avoid the second description. It
fails for four independent reasons:

* **Not all properties come from the DSL.** `tooltipTexts` in hotspots
  is written by the `Tooltip` component during inline editing, never by
  an `input` call. It is a map keyed by area id holding rich text -
  exactly what text extraction needs and exactly what introspection
  would never see.

* **The DSL branches on live state.** In `SidebarEditAreaView` the
  whole portrait tab only exists `if (portraitFile)`. A recording run
  describes one instance rather than the type, and omits properties
  precisely when they happen to be unset.

* **Nested shapes are not expressed.** `this.view(AreasListView, ...)`
  names a view class, not "array of area objects". The area shape lives
  in a second view reached by convention, with no link a machine can
  follow.

* **Editor code is not loadable everywhere.** The published frontend
  and an MCP server must not import `editor.js`.

### Collecting references at render time

Content elements already know their files - they build
`InlineFileRights` items from them. Aggregating those through a React
context would need no schema, would be conditionally exact by
construction and would work in the editor and with legacy data for
free. Every section stays mounted, so that is not the obstacle.

It fails on conditionally *rendered* UI. Tooltip images, fullscreen
viewers and non-current gallery slides render their rights only while
open, yet credits must list those files whether or not a visitor opened
them. Render time collection under-reports exactly the files that are
easiest to forget.

### Computing the answer on the server

A server computed list of referenced files is a cache whose
invalidation trigger is "any configuration change" - and the editor is
where configuration changes. So the seed carries locations and the
algorithm ships in the bundle. Server side rendering is unaffected,
since the same JavaScript runs in Node with the seed in hand.

Bundling the schemas into the JavaScript packages instead would undo
the seed's pruning: the seed already carries only the content element
types an entry uses, so an entry using five of thirty types pays for
five, while a bundle import pays for all of them in every entry and
grows with every plugin pack. The editor is the exception and receives
all types, since content elements can be added there without reloading
the seed.

### Structured references in the data

Storing `{collection, permaId}` instead of a bare integer would make
new data self-describing, and `transientReferences#setReference` is a
single choke point. It is not an alternative to this design:
backfilling legacy data requires knowing which integers to convert,
which requires the schema.

## Deliberate absences

* **The editor's backdrop bookkeeping.** Switching backdrop type stays
  lossless because the previous values are retained in separate
  attributes next to `backdrop`. They are left undescribed on purpose:
  the frontend never reads them, and an MCP client offered both would
  have two contradictory ways to describe one backdrop.

* **`anyOf` documents variants rather than enforcing them.** With every
  property optional, a blob holding both an image and a video still
  validates. Enforcing exclusivity needs `oneOf` plus disjointness,
  which also rejects the empty and partial objects that occur in real
  data.

## Traps

* **Used is not referenced.** `Pageflow::UsedFile` and
  `Pageflow::FileUsage` mean that a file belongs to a revision, which
  is weaker than a configuration pointing at it. Every referenced file
  is used; the entry's library is full of used files nothing
  references. The seed's file list therefore cannot answer which files
  an entry references.

* **Three reference sources sit outside the scrolled schemas.** Entry
  metadata (`share_image_id`, declared in core), files nested in
  another file (text tracks belonging to their parent video) and file
  configurations (video poster images). Each produces a false
  "unreferenced" verdict on its own.

* **The attribute mapping wants to exist twice.**
  `collectEntryFileReferences` takes entry state collections rather
  than Backbone models so that the snake cased to camel cased mapping
  is shared with the preview. When it existed twice it drifted - the
  share image reached the published entry before it reached the editor.
