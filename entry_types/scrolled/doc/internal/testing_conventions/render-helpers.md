# Render helpers

Part of the [Testing Conventions](../testing_conventions.md) guide, which
defines the **kind / scope / context / unit** vocabulary used here.

## Two kinds of render helpers

**Scoped fixtures** (white-box) set up the providers/state for a single
scope and render a component in isolation of the surrounding entry. Most
ship as part of the public API (`pageflow-scrolled/testHelpers`) so that
content element plugins can use them too.

**End-to-end helpers** (black-box) render the whole entry through the
official `Entry` component and interact with it via *page objects*. They
live in `spec/support/` and are internal to this package.

The import path follows from the kind: public scoped fixtures from
`pageflow-scrolled/testHelpers`; page objects and `renderEntry` from
`support/pageObjects`.

| Helper | Scope |
| --- | --- |
| `renderInEntry` | Entry state + `RootProviders`. For any component that needs entry state but nothing more. |
| `renderHookInEntry` | Same as `renderInEntry`, for selector hooks that read entry state. |
| `renderInContentElement` | Content-element scope: attributes, lifecycle, command emitter, optional inline-editing context. For components rendered *inside* a content element. |
| `renderEntry` | Full `Entry`, driven through page objects (`getContentElementByTestId`, `getSectionByPermaId`). For cross-cutting frontend features and integration behavior. |

`renderWithReviewState` is an internal scoped fixture for `src/review/`
UI, imported from `support/renderWithReviewState`; it sets up
`ReviewStateProvider` only.

## Picking a helper

Pick the smallest-scope helper sufficient for the behavior under test. A
component's scope is set by what it must render against — which providers
and state:

- A content element's component (`src/contentElements/<name>/<Component>.js`)
  → `renderInContentElement`, asserting with [matchers](matchers.md).
- A reusable frontend component (`src/frontend/<Component>.js`) →
  `renderInEntry`, or `renderInContentElement` if it needs the
  content-element scope.
- A cross-cutting feature that only exists *because pieces compose*
  (margins between elements, section transitions, alignment within a
  layout) → `renderEntry` with page objects.

`renderInContentElement` returns extra controls beyond the
`@testing-library/react` result — `simulateScrollPosition`,
`triggerEditorCommand`, `simulateStorylineMode` — and takes an
`inlineEditing` option that opts the element into an inline-editing
context (pass `true` for editable defaults, or an object to override
individual flags). See the helper's source for the exact surface.

## Setup hooks

Setup hooks are `useXxx()` functions called at the top of a `describe`
block; each installs a `beforeEach`. Group them at the top of the block,
in the order they appear below.

| Hook | Import from | Installs |
| --- | --- | --- |
| `usePageObjects` | `support/pageObjects` | Page-object queries for `renderEntry`, the `withTestId` helper content element, and `jest.restoreAllMocks()` per test. |
| `useInlineEditingPageObjects` / `useCommentingPageObjects` | `support/pageObjects` | Page-object sugar for the respective extension, built on `usePageObjects`. |
| `useContentElementMatchers` | `pageflow-scrolled/testHelpers` | The public content element [matchers](matchers.md). |
| `useContentElementLayoutMatchers` | `support/matchers` | The internal content element layout [matchers](matchers.md). |
| `useSectionMatchers` | `support/matchers` | The internal section [matchers](matchers.md). |
| `useFakeFeatures` | `pageflow/testHelpers` | Enables named feature flags for the test. |

(`useEditorGlobals`, `useFakeMedia`, and `useFakeParentWindow` are
further fixtures for editor, media, and parent-window scenarios.)

## Checks

- ❌ Reaching for `renderEntry` where a scoped fixture suffices — use the
  smallest scope the behavior needs; `renderEntry` is for behavior that
  only exists because pieces compose.
- ❌ Asserting an internal layout or section [matcher](matchers.md) on a
  subject from `renderInContentElement` — those wrappers only exist under
  `renderEntry`.
- ❌ The same custom `wrapper` copied across specs — a recurring setup
  need signals the testing API should grow a named option (like
  `renderInContentElement`'s `inlineEditing`), not repeated wrappers.
