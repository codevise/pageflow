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
framework applies around it**. Each tier below has a fixed subject and
setup hook; the matchers live one file per matcher in the directory
noted, which is the source of truth for their exact signatures and
assertions.

**Public matchers** cover chrome a content element opts into through
framework components — plugin authors need these to test their own
components. Shipped via `pageflow-scrolled/testHelpers`, enabled with
`useContentElementMatchers()`; the subject is a `renderInContentElement`
container or a `renderEntry` page object. In `src/testHelpers/matchers/`:
`toContainContentElementBox`, `toContainFitViewport`.

**Internal layout matchers** cover framework state applied *around* the
element (margins, scroll space, alignment). They depend on the
entry-level layout, so the subject must come from `renderEntry` —
`renderInContentElement` does not render these wrappers. Enabled with
`useContentElementLayoutMatchers()`. In
`spec/support/matchers/contentElement/`: `toHaveContentElementMargin`,
`toHaveScrollSpace`, `toHaveAlignment`.

**Section matchers** assert a section's foreground/layout state. The
subject is a section page object (`getSectionByPermaId(...)`), so they
also require `renderEntry`. Enabled with `useSectionMatchers()`. In
`spec/support/matchers/section/`: `toHaveSuppressedPadding`,
`toHaveRemainingSpace`, `toHaveForcedPadding`, `toHaveFadedOutForeground`,
`toHavePerElementFadeTransition`, `toHaveFirstBoxSuppressedTopMargin`,
`toHaveConstrainedContentWidth`.

The `useXxx` hooks are listed under
[Setup hooks](render-helpers.md#setup-hooks).

## Adding a matcher

Ask: *would an external plugin's test suite need this to verify their
component behaves correctly?* If yes, it is public; if it asserts
framework state the plugin does not control, it is internal. Register it
through the hook for its tier — `useContentElementMatchers` (public),
`useContentElementLayoutMatchers` (internal layout), or
`useSectionMatchers` (section) — so specs opt in explicitly, mirroring
`usePageObjects`.

## Checks

- ❌ An internal layout or section matcher asserted on a subject from
  `renderInContentElement` — those wrappers only exist under `renderEntry`.
- ❌ A new matcher registered in the wrong tier — public is only for
  chrome a plugin controls through framework components; framework state
  applied around the element is internal.
- ❌ A matcher's job duplicated in a page object — matchers assert; page
  objects locate and act.
