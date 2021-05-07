# CHANGELOG

### Version 15.5.0

2021-05-07

[Compare changes](https://github.com/codevise/pageflow/compare/15-4-stable...v15.5.0)

#### Core

##### Manual Update Step

- Upgrade Webpack config

  Disable Babel compilation of `node_modules` directory to prevent
  error of the form "_typeof is not defined" in Video.js HTTP
  streaming service worker that is registered when DASH sources are
  used. Add the following lines to the host application's
  `config/webpack/environment.js` file:

  ```
  environment.config.merge(require('pageflow-scrolled/config/webpack'))

  // Opt into future default behavior of Webpacker [1] to work around
  // problems with Video.js DASH service worker.
  //
  // [1] https://github.com/rails/webpacker/pull/2624
  environment.loaders.delete('nodeModules')

  ```

  No longer precompiling `node_modules` means that some ES6 syntax
  included in some of the packages will end up in the
  bundle. `therubyracer` gem then causes "Use of const in strict mode"
  error during SSR. Upgrading the host application to use `mini_racer`
  instead fixes the problem.
  ([#1655](https://github.com/codevise/pageflow/pull/1655))

##### Rails Engine

- Allow registering entry type specific file importers
  ([#1684](https://github.com/codevise/pageflow/pull/1684))
- Nested revision components
  ([#1654](https://github.com/codevise/pageflow/pull/1654))
- Nested revision components
  ([#1654](https://github.com/codevise/pageflow/pull/1654))
- Upgrade to Devise 4.7
  ([#1657](https://github.com/codevise/pageflow/pull/1657))

##### Admin

- Validate user locale
  ([#1658](https://github.com/codevise/pageflow/pull/1658))

#### Paged Entry Type

- Add theme option for content text phone typography
  ([#1670](https://github.com/codevise/pageflow/pull/1670))
- Bug fix: Wait until listener is ready before requesting cookie notice
  ([#1650](https://github.com/codevise/pageflow/pull/1650))

#### Scrolled Entry Type

##### Rails Engine

- Color/font options for scrolled themes
  ([#1673](https://github.com/codevise/pageflow/pull/1673))
- Improve scrolled install generator
  ([#1682](https://github.com/codevise/pageflow/pull/1682))

##### Published Entry

- Add 360 image content element based on @egjs/view360
  ([#1675](https://github.com/codevise/pageflow/pull/1675),
   [#1676](https://github.com/codevise/pageflow/pull/1676))
- Add position wide for heading content elements
  ([#1678](https://github.com/codevise/pageflow/pull/1678))
- Remove chapter number from chapter box
  ([#1679](https://github.com/codevise/pageflow/pull/1679))
- Fix embed video opt in text color in inverted section
  ([#1671](https://github.com/codevise/pageflow/pull/1671))
- Handle player unallocated by empty pool
  ([#1668](https://github.com/codevise/pageflow/pull/1668))
- Horizontal scroller for desktop navigation bar
  ([#1669](https://github.com/codevise/pageflow/pull/1669))
- Improve file rights
  ([#1665](https://github.com/codevise/pageflow/pull/1665))
- Allow non latin characters in video embed caption
  ([#1664](https://github.com/codevise/pageflow/pull/1664))
- Hyphenate long text block headers
  ([#1662](https://github.com/codevise/pageflow/pull/1662))
- Upgrade Scrolled to Video.js 7
  ([#1655](https://github.com/codevise/pageflow/pull/1655))
- Improve before/after wiggle animation
  ([#1659](https://github.com/codevise/pageflow/pull/1659))
- Display notices for unsupported browser or non-js
  ([#1653](https://github.com/codevise/pageflow/pull/1653))
- Basic styles for print layout of scrolled entries
  ([#1652](https://github.com/codevise/pageflow/pull/1652))
- Bug fix: Hide frame around inline video on iOS 12
  ([#1680](https://github.com/codevise/pageflow/pull/1680))

##### Editor

- Prevent concurrent save requests for embed urls
  ([#1672](https://github.com/codevise/pageflow/pull/1672))
- Do not trigger multiple save requests for backdrop updates
  ([#1666](https://github.com/codevise/pageflow/pull/1666))
- Fix lazy loading in editor for Safari
  ([#1660](https://github.com/codevise/pageflow/pull/1660))
- Bug fix: Cascade model removal through ForeignKeySubsetCollection
  ([#1651](https://github.com/codevise/pageflow/pull/1651))

See
[15-4-stable branch](https://github.com/codevise/pageflow/blob/15-4-stable/CHANGELOG.md)
for previous changes.
