# Testing Conventions

Conventions for writing JavaScript tests in the `pageflow-scrolled`
package. Run the suite with `yarn test` and the linter with `yarn lint .`
from `entry_types/scrolled/package`.

This page defines the shared vocabulary; the topic guides below cover
each area in depth — read the one matching your task.

## Terminology

- **Kind** — the render approach: a *scoped fixture* (white-box) sets up
  a subset of providers and renders a component in isolation; an
  *end-to-end* helper (black-box) renders the whole `Entry` and drives it
  through page objects.
- **Scope** — how much of the running app a render helper sets up, from a
  single provider band (e.g. the content-element scope) up to the full
  entry. Pick the *smallest scope* sufficient for the behavior.
- **Context** — the extension environment a spec runs in: plain frontend,
  inline editing, or commenting. The directory path encodes it
  (`spec/frontend/`, `spec/frontend/inlineEditing/`,
  `spec/frontend/commenting/`).
- **Unit** — the source file, named export, or component under test; the
  spec path mirrors its source path.

## Guides

- [Render helpers](testing_conventions/render-helpers.md) — the two kinds
  of helper, how to pick one, custom wrappers, and the `useXxx` setup
  hooks.
- [Matchers](testing_conventions/matchers.md) — asserting element state;
  public vs. internal matchers, the polymorphic subject, and how to add
  one.
- [Spec file layout](testing_conventions/spec-layout.md) — where a spec
  file goes; unit specs vs. `features/`; placement across contexts.
