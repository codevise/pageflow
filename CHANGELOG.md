# CHANGELOG

### Version 16.0.0

2023-01-11

[Compare changes](https://github.com/codevise/pageflow/compare/15-x-stable...v16.0.0)

#### Core

##### Breaking Changes

- The `Theming` model has been renamed to `Site`.
  ([#1903](https://github.com/codevise/pageflow/pull/1903),
   [#1914](https://github.com/codevise/pageflow/pull/1914))

  Related associations like `Entry#theming` or
  `Account#default_theming` have been renamed to `Entry#site` and
  `Account#default_site` accordingly.

- Entry templates and theme customizations now belong to sites instead
  of accounts.
  ([#1904](https://github.com/codevise/pageflow/pull/1904),
   [#1915](https://github.com/codevise/pageflow/pull/1915))

  Accounts can now contain multiple sites with their own set of
  templates and customized theme.

##### Internal

- Add reusable GitHub workflow to run RSpec tests
  ([#1905](https://github.com/codevise/pageflow/pull/1905))

#### Scrolled Entry Type

- Simplify borders in default navigation mobile chapter menu
  ([#1913](https://github.com/codevise/pageflow/pull/1913))
- Add theme property for chapter link separator color
  ([#1912](https://github.com/codevise/pageflow/pull/1912))
- Add widget slot to default navigation
  ([#1911](https://github.com/codevise/pageflow/pull/1911))
- Improve theme property for default navigation progress bar height
  ([#1910](https://github.com/codevise/pageflow/pull/1910))
- Add theme option to use smaller menu icon variant
  ([#1909](https://github.com/codevise/pageflow/pull/1909))
- Allow using custom icons for share options
  ([#1907](https://github.com/codevise/pageflow/pull/1907))

[Compare changes](https://github.com/codevise/pageflow/compare/15-x-stable...master)

None so far.

See
[15-x-stable branch](https://github.com/codevise/pageflow/blob/15-x-stable/CHANGELOG.md)
for previous changes.
