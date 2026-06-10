# Matchers

Part of the [Testing Conventions](../testing_conventions.md) guide, which
defines the **kind / scope / context / unit** vocabulary used here.

Custom matchers assert the visual/structural state of a single element.
They keep page objects focused on *locating* and *acting*, and let the
same assertion run regardless of which render helper produced the
element.

## Polymorphic subject

Every matcher resolves its subject through `getElement(subject)`
(`src/testHelpers/matchers/getElement.js`), which returns
`subject?.el ?? subject`. The subject can therefore be either:

- a **DOM element** — e.g. the `container` from `renderInContentElement`, or
- a **page object** — e.g. `getContentElementByTestId(...)` from
  `renderEntry` (page objects expose their anchor as `.el`).

```js
expect(container).toContainContentElementBox({borderRadius: 'circle'});
expect(getContentElementByTestId('probe')).toHaveAlignment('right');
```

## Public vs internal

The dividing line is **what the content element controls** vs **what the
framework applies around it**.

**Public matchers** (`src/testHelpers/matchers/`, shipped via
`pageflow-scrolled/testHelpers`, enabled with `useContentElementMatchers()`)
cover chrome a content element opts into through framework components.
Plugin authors need these to test their own components.

| Matcher | Asserts |
| --- | --- |
| `toContainContentElementBox({boxShadow, borderRadius, outlineColor})` | A `<ContentElementBox>` is present (bare call), and the requested theme styles are applied. `.not` asserts absence. |
| `toContainFitViewport({aspectRatio})` | A `<FitViewport>` is present (bare call) with the requested aspect ratio. `.not` asserts absence. |

**Internal matchers** (`spec/support/matchers/contentElement/`, enabled
with `useContentElementLayoutMatchers()`) cover framework state applied
*around* the element. They depend on the entry-level layout, so the
subject must come from `renderEntry` — `renderInContentElement` does not
render these wrappers.

| Matcher | Asserts |
| --- | --- |
| `toHaveContentElementMargin({top, bottom, prevBottom, topTrimmed})` | A content element margin wrapper is present; the `--margin-*` custom properties (raw CSS strings) match; `topTrimmed` checks the trim class. `.not` asserts absence. |
| `toHaveScrollSpace()` | The element sits inside a scroll-space wrapper. |
| `toHaveAlignment(value)` | The element carries the alignment class for the given value. |

**Section matchers** (`spec/support/matchers/section/`, enabled with
`useSectionMatchers()`) assert a section's foreground/layout state. The
subject is a section page object (`getSectionByPermaId(...)`), so they
also require `renderEntry`.

| Matcher | Asserts |
| --- | --- |
| `toHaveSuppressedPadding({top, bottom})` | The foreground suppresses top/bottom padding. |
| `toHaveRemainingSpace({above, below})` | The foreground keeps remaining vertical space above/below the content. |
| `toHaveForcedPadding()` | The foreground forces padding (inline editing). |
| `toHaveFadedOutForeground()` | The foreground is faded out by a transition. |
| `toHavePerElementFadeTransition()` | The section uses the per-element fade transition. |
| `toHaveFirstBoxSuppressedTopMargin()` | The first foreground box has its top margin suppressed. |
| `toHaveConstrainedContentWidth()` | The section constrains its content width. |

These sets are registered through the `useXxx` hooks listed under
[Setup hooks](render-helpers.md#setup-hooks).

## Adding a matcher

Ask: *would an external plugin's test suite need this to verify their
component behaves correctly?* If yes, it is public; if it asserts
framework state the plugin does not control, it is internal. Register
public matchers through `useContentElementMatchers` and internal ones
through `useContentElementLayoutMatchers` so specs opt in explicitly,
mirroring `usePageObjects`.
