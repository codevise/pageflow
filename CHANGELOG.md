# CHANGELOG

### Version 16.2.0

2024-01-12

[Compare changes](https://github.com/codevise/pageflow/compare/16-1-stable...v16.2.0)

#### Core

##### Manual Update Steps

- Decouple host application from scrolled widget packs
  ([#2035](https://github.com/codevise/pageflow/pull/2035))

  Remove `defaultNavigation.js` and `consentBar.js` from
  `app/javascript/packs/pageflow-scrolled/widgets`.  Import
  `pageflow-scrolled/widgets-server` instead of
  `pageflow-scrolled/widgets/defaultNavigation` and
  `pageflow-scrolled/widgets/consentBar` in
  `app/javascript/packs/pageflow-scrolled-server.js`.

- Add experimental webp support
  ([#2020](https://github.com/codevise/pageflow/pull/2020),
   [#2027](https://github.com/codevise/pageflow/pull/2027))

  Pageflow now requires the `libvips` binary to be installed. See
  [`libvips` install
  instructions](https://www.libvips.org/install.html).

##### Published Entry

- Allow publishing entries with noindex robots meta tag
  ([#2032](https://github.com/codevise/pageflow/pull/2032))
- Allow removing cname domain suffix from entry title
  ([#2028](https://github.com/codevise/pageflow/pull/2028))

##### Editor

- Bug fix: Prevent caching wrong file perma ids
  ([#2049](https://github.com/codevise/pageflow/pull/2049))

##### Rails Engine

- Do not require auth object for ransackable_* methods
  ([#2037](https://github.com/codevise/pageflow/pull/2037))

##### JavaScript API

- Improve `TextAreaInputView` for usage outside editor
  ([#2038](https://github.com/codevise/pageflow/pull/2038))

##### Internal

- Rails 7.1 compatibility
  ([#2025](https://github.com/codevise/pageflow/pull/2025))
  ([#2024](https://github.com/codevise/pageflow/pull/2024))
  ([#2023](https://github.com/codevise/pageflow/pull/2023))
  ([#2048](https://github.com/codevise/pageflow/pull/2048))
  ([#2045](https://github.com/codevise/pageflow/pull/2045))
  ([#2044](https://github.com/codevise/pageflow/pull/2044))
  ([#2043](https://github.com/codevise/pageflow/pull/2043))
  ([#2029](https://github.com/codevise/pageflow/pull/2029))
  ([#2021](https://github.com/codevise/pageflow/pull/2021))
- Use Node 18 in CI
  ([#2046](https://github.com/codevise/pageflow/pull/2046))
- Replace webdrivers with selenium-webdriver 4.15
  ([#2026](https://github.com/codevise/pageflow/pull/2026))
- Fix accessing logs in headless Chrome 120
  ([#2040](https://github.com/codevise/pageflow/pull/2040))
- Vendor jQuery UI sortable for tests
  ([#2039](https://github.com/codevise/pageflow/pull/2039))

#### Paged Entry Type

##### Published Entry

- Add theme option to hide legal info button
  ([#2041](https://github.com/codevise/pageflow/pull/2041))
- Allow additional frontend packs without content element types
  ([#2042](https://github.com/codevise/pageflow/pull/2042))
- Bug fix: Fall back to entry when share page is missing
  ([#2050](https://github.com/codevise/pageflow/pull/2050))

#### Scrolled Entry Type

##### Published Entry

- Inline file rights
  ([#2033](https://github.com/codevise/pageflow/pull/2033))
  ([#2036](https://github.com/codevise/pageflow/pull/2036))
- Backdrop animations/stand alone position
  ([#2047](https://github.com/codevise/pageflow/pull/2047))
- Add tagline and subtitle to heading content element
  ([#2022](https://github.com/codevise/pageflow/pull/2022))
- Add feature flag to enlarge player pool
  ([#2031](https://github.com/codevise/pageflow/pull/2031))
- Use theme entry font for captions of fullscreen image galleries
  ([#2030](https://github.com/codevise/pageflow/pull/2030))

##### Internal

- Do not force local Paperclip storage in storybook seeds
  ([#2034](https://github.com/codevise/pageflow/pull/2034))

See
[16-1-stable branch](https://github.com/codevise/pageflow/blob/16-1-stable/CHANGELOG.md)
for previous changes.
