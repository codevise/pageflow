# Spec file layout

Part of the [Testing Conventions](../testing_conventions.md) guide, which
defines the **kind / scope / context / unit** vocabulary used here.

Specs mirror source structure. Two rules govern when a spec becomes a
directory:

1. A **`src/Foo.js`** source file corresponds to a **`spec/Foo-spec.js`**
   spec file. When it grows large enough to split into topics, it becomes
   a directory: topic files live at `spec/Foo/features/<topic>-spec.js`.
2. A **`src/Foo/`** source directory corresponds to a **`spec/Foo/`** spec
   directory, with one `spec/Foo/<helper>-spec.js` per
   `src/Foo/<helper>.js`. Topic splits of the main component live in
   `spec/Foo/features/` alongside the helper specs.

The `features/` sub-namespace is the *only* place topic splits live,
regardless of whether the unit under test is a `.js` file or a `/`
directory. This keeps spec layout invariant under
`src/Foo.js → src/Foo/index.js` refactorings.

A *unit spec* mirrors a single source unit and stays at the directory
level, named after that unit. A unit is usually a separate file
(`spec/Foo/<helper>-spec.js` for `src/Foo/<helper>.js`), but can also be
a **named export** of the main file — e.g. `AudioPlayer/index.js`
exports both the `AudioPlayer` component and a `processSources` helper,
so `processSources-spec.js` mirrors that export and is *not* a topic
split. (`structuredData-spec.js` in the same directory, which exercises
the component's behavior, is.)

`features/` holds the remaining *behavior-grouped* tests, written
against the unit's stable public interface; these tend to outlive the
internal helpers they exercise. The path's scope and context determine
which render helper and setup hooks the specs in that directory use.

**`features/` attaches to the level of the unit under test.** The
directory path identifies the unit — whatever has a source counterpart
at that path — and `features/` nests *under* it to group that unit's
behavior topics; it never floats up to the context root. So the
`EditableText` component (`src/frontend/inlineEditing/EditableText/`)
owns `spec/frontend/inlineEditing/EditableText/features/`, with its
helper specs (`blocks-spec.js`, `marks-spec.js`, …) alongside.
Conversely, behavior with no single source counterpart in a context —
the inline-editing integration itself (`contentElementSelection`,
`marginIndicator`) — lives directly in that context's
`spec/frontend/inlineEditing/features/`. The render helper a spec uses
is the *mechanism*, not the unit: most feature specs use `renderEntry`,
but that never turns a component into a topic of its parent context.

## Placement across contexts

The directory path encodes the *context* a spec runs in: specs under
`spec/frontend/inlineEditing/` load the inline-editing extension, those
under `spec/frontend/commenting/` the commenting extension, and those
directly under `spec/frontend/` neither. When a unit behaves differently
across these contexts, it gets one spec per context, named after the
unit, in the matching directory — the path conveys the context, so the
filenames stay identical.

Prefer committing to the public interface over its wiring. When a unit's
behavior changes across contexts because an extension swaps a provider —
an implementation detail you may want to refactor — test it end-to-end
through a fake consumer with `renderEntry`, rather than white-box-driving
the replacement mechanism (which couples the spec to how providers are
registered, not to the contract). For example `usePhonePlatform` is
asserted via a probe content element in
`spec/frontend/features/usePhonePlatform-spec.js` (default provider,
reads the `browser`) and
`spec/frontend/inlineEditing/features/usePhonePlatform-spec.js` (the
inline-editing provider, driven by the editor's emulation-mode
messages). Both live in `features/` because they exercise rendered
behavior; a spec that instead drove the hook directly with
`renderHookInEntry` would be a dir-level white-box unit spec.
