# CHANGELOG

### Unreleased Changes

[Compare changes](https://github.com/codevise/pageflow/compare/15-7-stable...master)

#### Core

##### Rails Engine

- Permalinks
  ([#1883](https://github.com/codevise/pageflow/pull/1883))
- Add user_changed hook
  ([#1859](https://github.com/codevise/pageflow/pull/1859))
- Allow adding id in data attribute when adding editor main menu item
  ([#1837](https://github.com/codevise/pageflow/pull/1837))

##### Admin

- Improve membership update
  ([#1862](https://github.com/codevise/pageflow/pull/1862))

##### Editor

- Improve file import controller
  ([#1847](https://github.com/codevise/pageflow/pull/1847))

##### Published Entry

- Display opt-out vendors as accepted by default on privacy page
  ([#1899](https://github.com/codevise/pageflow/pull/1899))

##### JavaScript API

- Pass alt text in media events
  ([#1901](https://github.com/codevise/pageflow/pull/1901))
- Provide more tracking data
  ([#1885](https://github.com/codevise/pageflow/pull/1885))

##### Internal

- Migrate to supported setup-ruby action
  ([#1892](https://github.com/codevise/pageflow/pull/1892))


#### Paged Entry Type

##### Published Entry

- Add feature flag to enforce usage of FullHD videos
  ([#1879](https://github.com/codevise/pageflow/pull/1879))
- Allow enforcing best video quality in Paged entries
  ([#1863](https://github.com/codevise/pageflow/pull/1863))
- Ensure scroller content is accessible via OS X Spoken Content
  ([#1870](https://github.com/codevise/pageflow/pull/1870))

##### Internal

- Missing semicolon in themes/default/page.scss
  ([#1898](https://github.com/codevise/pageflow/pull/1898))

#### Scrolled Entry Type

##### Editor

- Set correct lang attribute on html element in editor preview iframe
  ([#1867](https://github.com/codevise/pageflow/pull/1867),
   [#1872](https://github.com/codevise/pageflow/pull/1872))
- Bug: Ensure link tooltip is readable in inverted sections
  ([#1849](https://github.com/codevise/pageflow/pull/1849))

##### Published Entry

- Section and chapter inline links
  ([#1886](https://github.com/codevise/pageflow/pull/1886))
- Typography variants
  ([#1842](https://github.com/codevise/pageflow/pull/1842),
   [#1845](https://github.com/codevise/pageflow/pull/1845))
- Improve backdrop hiding
  ([#1882](https://github.com/codevise/pageflow/pull/1881),
   [#1881](https://github.com/codevise/pageflow/pull/1882))
- Backdrop effects
  ([#1841](https://github.com/codevise/pageflow/pull/1841),
   [#1846](https://github.com/codevise/pageflow/pull/1846))
- Make border radius of cards appearance configurable
  ([#1838](https://github.com/codevise/pageflow/pull/1838))
- Allow using SVG images as backdrops and inline images
  ([#1860](https://github.com/codevise/pageflow/pull/1860))
- Improve scrolled favicons
  ([#1858](https://github.com/codevise/pageflow/pull/1858))
- Use public translations from pageflow-public-i18n in scrolled
  ([#1853](https://github.com/codevise/pageflow/pull/1853))
- Rewrite backdrop/motif area logic based on CSS as experimental feature
  ([#1854](https://github.com/codevise/pageflow/pull/1854),
   [#1855](https://github.com/codevise/pageflow/pull/1855),
   [#1856](https://github.com/codevise/pageflow/pull/1856))
- Bug: Prevent foreground shadow from overlaying next section
  ([#1900](https://github.com/codevise/pageflow/pull/1900))
- Bug: Ensure backdrop covers viewport in iOS in-app browers
  ([#1884](https://github.com/codevise/pageflow/pull/1884))

##### Content Elements

- Disable automatic hyphenation in text block headings
  ([#1875](https://github.com/codevise/pageflow/pull/1875))
- Disable top padding for new headings
  ([#1896](https://github.com/codevise/pageflow/pull/1896))
- Remove space before heading in cards appearance
  ([#1851](https://github.com/codevise/pageflow/pull/1851))
- Text block line breaks
  ([#1869](https://github.com/codevise/pageflow/pull/1869),
   [#1871](https://github.com/codevise/pageflow/pull/1871))
- Improve mobile block quote size
  ([#1868](https://github.com/codevise/pageflow/pull/1868))
- Preserve Tweet hide when unloading
  ([#1864](https://github.com/codevise/pageflow/pull/1864))
- Question content element
  ([#1861](https://github.com/codevise/pageflow/pull/1861))
- Improve video embed content element
  ([#1848](https://github.com/codevise/pageflow/pull/1848),
   [#1850](https://github.com/codevise/pageflow/pull/1850))

##### Widgets

- Fix info box position when all share providers are disabled
  ([#1877](https://github.com/codevise/pageflow/pull/1877))
- Add option to prevent collapsing default navigation on desktop
  ([#1891](https://github.com/codevise/pageflow/pull/1891))
- Options for scrolled default navigation
  ([#1866](https://github.com/codevise/pageflow/pull/1866))

##### Themes

- Let themes define external link list variants
  ([#1880](https://github.com/codevise/pageflow/pull/1880))
- Text block theme properties
  ([#1873](https://github.com/codevise/pageflow/pull/1873))
- Add theme properties for cards colors
  ([#1865](https://github.com/codevise/pageflow/pull/1865))
- Pass consistent arguments when transforming theme options
  ([#1844](https://github.com/codevise/pageflow/pull/1844))

##### Internal

- Also set Webpack public path for editor JS.
  ([#1874](https://github.com/codevise/pageflow/pull/1874))

See
[15-7-stable branch](https://github.com/codevise/pageflow/blob/15-7-stable/CHANGELOG.md)
for previous changes.
