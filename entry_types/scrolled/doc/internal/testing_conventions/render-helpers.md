# Render helpers

Part of the [Testing Conventions](../testing_conventions.md) guide, which
defines the **kind / scope / context / unit** vocabulary used here.

## Two kinds of render helpers

**Scoped fixtures** (white-box) set up the providers/state for a single
scope and render a component in isolation of the surrounding entry. They
ship as part of the public API (`pageflow-scrolled/testHelpers`) so that
content element plugins can use them too.

**End-to-end helpers** (black-box) render the whole entry through the
official `Entry` component and interact with it via *page objects*. They
live in `spec/support/` and are internal to this package.

| Helper | Import from | Scope |
| --- | --- | --- |
| `renderInEntry` | `pageflow-scrolled/testHelpers` | Entry state + `RootProviders`. For any component that needs entry state but nothing more. |
| `renderHookInEntry` | `pageflow-scrolled/testHelpers` | Same as `renderInEntry`, for selector hooks that read entry state. |
| `renderInContentElement` | `pageflow-scrolled/testHelpers` | Content-element scope: attributes, lifecycle, command emitter, optional inline-editing context. For components rendered *inside* a content element. |
| `renderWithReviewState` | `pageflow-scrolled/testHelpers` | `ReviewStateProvider` only. For code in `src/review/`. |
| `renderEntry` | `support/pageObjects` | Full `Entry`. Returns page-object queries (`getContentElementByTestId`, `getSectionByPermaId`). For cross-cutting frontend features and integration behavior. |

## Picking a helper

Pick the smallest-scope helper sufficient for the behavior under test.
The path of the spec file is the strongest signal: `spec/<path>-spec.js`
mirrors `src/<path>.js`, and the scope at that path determines which
helper to use.

- A content element's component (`src/contentElements/<name>/<Component>.js`)
  → `renderInContentElement`, asserting with [matchers](matchers.md).
- A reusable frontend component (`src/frontend/<Component>.js`) →
  `renderInEntry`, or `renderInContentElement` if it needs the
  content-element scope.
- A cross-cutting feature that only exists *because pieces compose*
  (margins between elements, section transitions, alignment within a
  layout) → `renderEntry` with page objects.

`renderInContentElement` returns extra controls beyond the
`@testing-library/react` result: `simulateScrollPosition`,
`triggerEditorCommand`, and `simulateStorylineMode`. Its `inlineEditing`
option opts the element into an inline-editing context — pass `true` for
editable defaults or an object (`{isEditable, isSelected,
transientState}`) to override.

## Custom wrappers

`renderInEntry` and `renderInContentElement` accept a `wrapper` option: a
`({children}) => JSX` component that adds extra providers around the
rendered tree. Use it for a one-off provider combination a test needs.

When a combination is common enough to be discoverable, add a named
option to the render helper that installs the providers internally —
this is how `renderInContentElement`'s `inlineEditing` option works —
rather than repeating the same custom `wrapper` across specs.

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
