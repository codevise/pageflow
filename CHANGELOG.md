# CHANGELOG

### Unreleased Changes

[Compare changes](https://github.com/codevise/pageflow/compare/16-0-stable...master)

#### Core

##### Published Entry

- Add feature flag to use HLS in all Desktop browsers
  ([#1924](https://github.com/codevise/pageflow/pull/1924))
- Atom feeds
  ([#1941](https://github.com/codevise/pageflow/pull/1941),
   [#1949](https://github.com/codevise/pageflow/pull/1949))
- Add XML sitemaps for sites
  ([#1944](https://github.com/codevise/pageflow/pull/1944),
   [#1945](https://github.com/codevise/pageflow/pull/1945))
  ([#1924](https://github.com/codevise/pageflow/pull/1924))
- Allow using custom feeds urls for sites
  ([#1952](https://github.com/codevise/pageflow/pull/1952),
   [#1953](https://github.com/codevise/pageflow/pull/1953))

##### Admin

- Hide permalink directory drop down with single item
  ([#1917](https://github.com/codevise/pageflow/pull/1917))

##### Editor

- Allow turning default widgets off
  ([#1965](https://github.com/codevise/pageflow/pull/1965))
- Use short label for editor help button
  ([#1970](https://github.com/codevise/pageflow/pull/1970))
- Filter out widgets of unknown widget types
  ([#1961](https://github.com/codevise/pageflow/pull/1961))
- Bug fix: Prevent normalizing color input too early
  ([#1992](https://github.com/codevise/pageflow/pull/1992))
- Bug fix: Do not scale images up when creating panorama styles
  ([#1920](https://github.com/codevise/pageflow/pull/1920))

##### Rails Engine

- Add public_entry_cache_control_header config option
  ([#1999](https://github.com/codevise/pageflow/pull/1999))
- Make default published until duration configurable
  ([#1955](https://github.com/codevise/pageflow/pull/1955))
- Exclude react-rails 2.7 from supported versions
  ([#1963](https://github.com/codevise/pageflow/pull/1963))
- Allow any 2.6 version of react-rails
  ([#1964](https://github.com/codevise/pageflow/pull/1964))

##### JavaScript API

- Add throttled media events
  ([#1939](https://github.com/codevise/pageflow/pull/1939))

##### Documentation

- Make CORS config json
  ([#1956](https://github.com/codevise/pageflow/pull/1956))

##### Internal

- Run core specs agains Rails 6.1/Ruby 3.2
  ([#1998](https://github.com/codevise/pageflow/pull/1998))
- Fix Zeitwerk compatibility
  ([#2013](https://github.com/codevise/pageflow/pull/2013))
- Run plugin specs in reusable workflow against Rails 6.1
  ([#2012](https://github.com/codevise/pageflow/pull/2012))
- Move RailsVersion helper from support to core gem
  ([#2006](https://github.com/codevise/pageflow/pull/2006))
- Fix paged specs for Rails 6
  ([#2004](https://github.com/codevise/pageflow/pull/2004))
- Fix scrolled specs for Rails 6
  ([#2003](https://github.com/codevise/pageflow/pull/2003))
- Fix core specs for Rails 6
  ([#2000](https://github.com/codevise/pageflow/pull/2000))
- Fix Active Record errors deprecation warning
  ([#2015](https://github.com/codevise/pageflow/pull/2015))
- Fix SSR webpack-dev-server client code removal for Webpack 5
  ([#2018](https://github.com/codevise/pageflow/pull/2018))
- Support both Webpacker and Shakapacker
  ([#2017](https://github.com/codevise/pageflow/pull/2017))
- Remove Coveralls integration
  ([#2016](https://github.com/codevise/pageflow/pull/2016))
- Fix webdrivers for Chrome 115
  ([#1983](https://github.com/codevise/pageflow/pull/1983))

#### Paged Entry Type

##### Published Entry

- Bug fix: Fix scrolling classic page content on Windows 10 with touch screen
  ([#1916](https://github.com/codevise/pageflow/pull/1916))

##### Internal

- Allow seeding text to paged entries
  ([#1929](https://github.com/codevise/pageflow/pull/1929))

#### Scrolled Entry Type

##### Published Entry

- Support portrait backdrop videos
  ([#1930](https://github.com/codevise/pageflow/pull/1930))
- Clear inlined float
  ([#1995](https://github.com/codevise/pageflow/pull/1995))
- Allow placing floated elements side by side
  ([#1979](https://github.com/codevise/pageflow/pull/1979))
- Improve blessing media elements for iOS
  ([#1928](https://github.com/codevise/pageflow/pull/1928))
- Make feature flag to enforce FullHD videos available for scrolled
  ([#1927](https://github.com/codevise/pageflow/pull/1927))
- Upgrade to video.js 7.21 and http-streaming 2.16
  ([#1925](https://github.com/codevise/pageflow/pull/1925))- Decrease external link font size on mobile
  ([#1926](https://github.com/codevise/pageflow/pull/1926))
- Reduce spacing between list items
  ([#1938](https://github.com/codevise/pageflow/pull/1938))
- Make text block spacing more consistent between editor and published entry
  ([#1997](https://github.com/codevise/pageflow/pull/1997))
- Improve onVisible/onInvisible callbacks
  ([#1947](https://github.com/codevise/pageflow/pull/1947),
   [#1950](https://github.com/codevise/pageflow/pull/1950))
- Set text direction attribute for scrolled entries
  ([#1975](https://github.com/codevise/pageflow/pull/1975))
- Use Rails fragment cache for scrolled entries
  ([#2001](https://github.com/codevise/pageflow/pull/2001))
- Fix two column motif area content measuring
  ([#1990](https://github.com/codevise/pageflow/pull/1990))
- Bug fix: Ignore volume setting in Scrolled
  ([#1921](https://github.com/codevise/pageflow/pull/1921))
- Bug fix: Prevent line artifact between sections on Chrome
  ([#1935](https://github.com/codevise/pageflow/pull/1935))
- Bug fix: Remove legacy clip for revealed sections
  ([#1993](https://github.com/codevise/pageflow/pull/1993))

##### Content Elements

- Enable full screen view for inline images
  ([#1902](https://github.com/codevise/pageflow/pull/1902))
- Add stand-alone quote element
  ([#1931](https://github.com/codevise/pageflow/pull/1931),
   [#1932](https://github.com/codevise/pageflow/pull/1932),
   [#1958](https://github.com/codevise/pageflow/pull/1958),
   [#1982](https://github.com/codevise/pageflow/pull/1982))
- Add counter content element
  ([#1934](https://github.com/codevise/pageflow/pull/1934),
   [#1940](https://github.com/codevise/pageflow/pull/1940),
   [#1943](https://github.com/codevise/pageflow/pull/1943),
   [#1984](https://github.com/codevise/pageflow/pull/1984),
   [#2007](https://github.com/codevise/pageflow/pull/2007))
- Add image gallery content element
  ([#1966](https://github.com/codevise/pageflow/pull/1966),
   [#1980](https://github.com/codevise/pageflow/pull/1980),
   [#1968](https://github.com/codevise/pageflow/pull/1968),
   [#1969](https://github.com/codevise/pageflow/pull/1969),
   [#1978](https://github.com/codevise/pageflow/pull/1978))
- Custom margin for image galleries
  ([#1971](https://github.com/codevise/pageflow/pull/1971),
   [#1972](https://github.com/codevise/pageflow/pull/1972),
   [#1973](https://github.com/codevise/pageflow/pull/1973))
- Content element widths
  ([#1989](https://github.com/codevise/pageflow/pull/1989))
- Consent opt-in for iframe embed element
  ([#2005](https://github.com/codevise/pageflow/pull/2005))
- Bug fix: Prevent white lines around external link image
  ([#1994](https://github.com/codevise/pageflow/pull/1994))
- Allow setting portrait version for inline videos
  ([#2019](https://github.com/codevise/pageflow/pull/2019))

##### Widgets

- Display rights of all files in credits box
  ([#1959](https://github.com/codevise/pageflow/pull/1959))
- Extract scrolled consent bar into widget
  ([#1976](https://github.com/codevise/pageflow/pull/1976))

##### Editor

- Display and edit section transitions via outline
  ([#2009](https://github.com/codevise/pageflow/pull/2009),
   [#2010](https://github.com/codevise/pageflow/pull/2010),
   [#2011](https://github.com/codevise/pageflow/pull/2011))
- Duplicating sections
  ([#2008](https://github.com/codevise/pageflow/pull/2008))
- Add file type drop down to link dialog
  ([#1919](https://github.com/codevise/pageflow/pull/1919))
- File links
  ([#1918](https://github.com/codevise/pageflow/pull/1918))
- Introduce palettes
  ([#1936](https://github.com/codevise/pageflow/pull/1936),
   [#1946](https://github.com/codevise/pageflow/pull/1946))
- Introduce file type priorities to fix text track upload in scrolled
  ([#1962](https://github.com/codevise/pageflow/pull/1962))
- Do not display single item position drop down
  ([#1996](https://github.com/codevise/pageflow/pull/1996))

##### Theme API

- Improve content color properties
  ([#1923](https://github.com/codevise/pageflow/pull/1923))
- Make content text color available in custom property
  ([#1937](https://github.com/codevise/pageflow/pull/1937))
- Add theme properties for quote mark font family and color
  ([#1977](https://github.com/codevise/pageflow/pull/1977))
- Add list related theme properties
  ([#1981](https://github.com/codevise/pageflow/pull/1981))
- Add theme property for marker color of unordered list items
  ([#1985](https://github.com/codevise/pageflow/pull/1985))
- Allow changing light and dark text color of headings
  ([#1987](https://github.com/codevise/pageflow/pull/1987))
- Allow using SVG data URLs as quote marks
  ([#1988](https://github.com/codevise/pageflow/pull/1988))
- Allow coloring SVG quote mark symbol with palette colors
  ([#2002](https://github.com/codevise/pageflow/pull/2002))
- Let themes use quote variant with centered quote mark
  ([#2014](https://github.com/codevise/pageflow/pull/2014))

##### Internal

- Support scopes in storybook theme properties
  ([#1986](https://github.com/codevise/pageflow/pull/1986))
- Use different widths in appearance stories
  ([#1991](https://github.com/codevise/pageflow/pull/1991))

See
[16-0-stable branch](https://github.com/codevise/pageflow/blob/16-0-stable/CHANGELOG.md)
for previous changes.
