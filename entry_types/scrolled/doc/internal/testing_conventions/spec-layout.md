# Spec file layout

Part of the [Testing Conventions](../testing_conventions.md) guide, which
defines the **kind / scope / context / unit** vocabulary used here.

Specs mirror source structure. This guide tells you where a new spec file
goes: start with the decision procedure; the rationale and checks below
settle the cases it doesn't spell out.

## Where does my spec go?

Find the source you're testing, then read off the spec path:

| Source | Spec path |
| --- | --- |
| `src/Foo.js` (unsplit) | `spec/Foo-spec.js` |
| `src/Foo.js` or `src/Foo/index.js`, split into topics | `spec/Foo/features/<topic>-spec.js` |
| `src/Foo/<helper>.js` | `spec/Foo/<helper>-spec.js` |
| a **named export** of `src/Foo/index.js` | `spec/Foo/<export>-spec.js` |

Two kinds of spec live under a `spec/Foo/` directory, and they answer to
different sources:

- **Unit specs** mirror a single source unit — a `src/Foo/<helper>.js`
  file or a named export of the main file — and sit at the directory
  level, named after that unit. Example: `AudioPlayer/index.js`
  exports both the `AudioPlayer` component and a `processSources`
  helper, so `processSources-spec.js` tests that helper at the
  directory level.
- **Topic splits** of the main unit's own behavior go under `features/`,
  never beside it. The `AudioPlayer` component's rendered behavior (e.g.
  its structured-data output) is a topic, so it lives at
  `features/structuredData-spec.js`.

`features/` is the *only* place topic splits live — for a `.js` file and
a `/` directory unit alike. These specs are written against the unit's
stable public interface, so they tend to outlive the internal helpers
they exercise.

## Placement across contexts

The directory path encodes the *context* a spec runs in:

| Directory | Context (loaded extension) |
| --- | --- |
| `spec/frontend/` | none |
| `spec/frontend/inlineEditing/` | inline editing |
| `spec/frontend/commenting/` | commenting |

When a unit behaves differently across contexts, give it **one spec per
context**, named after the unit, in the matching directory. The path
conveys the context, so the filenames stay identical.

The context also determine which render helper and setup hooks a spec
uses — see [render helpers](render-helpers.md).

## Which level owns `features/`?

`features/` groups a unit's behavior topics, so it sits at the level of
whatever it tests. Ask whether that behavior has a single source
counterpart:

- **It does** → `features/` nests under that unit. The `EditableText`
  component (`src/frontend/inlineEditing/EditableText/`) owns
  `spec/frontend/inlineEditing/EditableText/features/`, with its helper
  specs (`blocks-spec.js`, `marks-spec.js`, …) alongside.
- **It doesn't** — the behavior *is* a context's integration
  (`contentElementSelection`, `marginIndicator` for inline editing) →
  `features/` sits at that context root,
  `spec/frontend/inlineEditing/features/`.

## Rationale

- **Why `features/` is the only home for topic splits.** It keeps spec
  layout invariant under a `src/Foo.js → src/Foo/index.js` refactoring:
  the topic specs don't move when the source file becomes a directory.
- **Why a unit's behavior tests live in exactly one place.** A flat
  `spec/Foo-spec.js` and a `spec/Foo/features/` directory both holding
  behavior tests is the tell-tale of that refactoring leaving the
  top-level spec behind. They must not coexist (see checks).
- **Why the render helper doesn't decide ownership.** The helper a spec
  uses is the *mechanism*, not the unit. Most feature specs use
  `renderEntry`, but that never turns a component into a topic of its
  parent context — the source counterpart at the path does.
- **Why prefer the public interface over its wiring.** When behavior
  changes across contexts because an extension swaps a provider — an
  implementation detail you may want to refactor — test it end-to-end
  through a fake consumer with `renderEntry`, not by white-box-driving
  the replacement mechanism (which couples the spec to how providers are
  registered, not to the contract).

## Checks

Scan for these before opening a PR:

- ❌ `spec/Foo-spec.js` coexisting with `spec/Foo/features/` — a
  refactoring left the top-level spec behind; fold it into `features/`.
  (Helper and named-export unit specs at `spec/Foo/<helper>-spec.js`
  *may* sit beside a flat `spec/Foo-spec.js` — they test different units.
  It is specifically `Foo-spec.js` together with `Foo/features/` that
  must not coexist.)
- ❌ A topic split living outside `features/` (e.g. beside the helper
  specs) — move it under `features/`.
- ❌ A `features/` directory floated up to the context root when the
  behavior *does* have a source counterpart deeper in the tree — push it
  down to the unit that owns it.
- ❌ The same spec duplicated per context when its behavior doesn't
  actually differ by context — one spec per context is for behavior that
  *changes* across them, not identical assertions.
