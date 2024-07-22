# CHANGELOG

### Unreleased Changes

[Compare changes](https://github.com/codevise/pageflow/compare/17-0-stable...master)


#### Core

##### Published Entry

- Entry translations/hreflang alternate links
  ([#2059](https://github.com/codevise/pageflow/pull/2059))
- Allow registering additional headers for published entries
  ([#2112](https://github.com/codevise/pageflow/pull/2112))
- Always use jpg for social share images
  ([#2118](https://github.com/codevise/pageflow/pull/2118))
- Allow opening external privacy settings via privacy link
  ([#2120](https://github.com/codevise/pageflow/pull/2120),
   [#2130](https://github.com/codevise/pageflow/pull/2130))
- Replace mentions of Twitter with X
  ([#2111](https://github.com/codevise/pageflow/pull/2111))

##### Admin

- Create default permalink directory for new sites
  ([#2105](https://github.com/codevise/pageflow/pull/2105))
- Make user admin attributes table extensible
  ([#2087](https://github.com/codevise/pageflow/pull/2087))
- Add config option to redirect to editor after entry create
  ([#2085](https://github.com/codevise/pageflow/pull/2085))

##### Editor

- Auto-orient images when determining dimensions
  ([#2113](https://github.com/codevise/pageflow/pull/2113))

##### JavaScript API

- Improve media events
  ([#2070](https://github.com/codevise/pageflow/pull/2070),
   [#2071](https://github.com/codevise/pageflow/pull/2071))
- Pass entry model to additional editor initializers
  ([#2082](https://github.com/codevise/pageflow/pull/2082))

##### Rails Engine

- Invoke hook when entry is created via admin
  ([#2078](https://github.com/codevise/pageflow/pull/2078))
- Extend version range to allow Resque 2
  ([#2054](https://github.com/codevise/pageflow/pull/2054))

##### Internal

- Upgrade development dependencies
  ([#2079](https://github.com/codevise/pageflow/pull/2079),
   [#2074](https://github.com/codevise/pageflow/pull/2074),
   [#2073](https://github.com/codevise/pageflow/pull/2073),
   [#2072](https://github.com/codevise/pageflow/pull/2072),
   [#2068](https://github.com/codevise/pageflow/pull/2068),
   [#2067](https://github.com/codevise/pageflow/pull/2067),
   [#2062](https://github.com/codevise/pageflow/pull/2062),
   [#2061](https://github.com/codevise/pageflow/pull/2061),
   [#2053](https://github.com/codevise/pageflow/pull/2053),
   [#1888](https://github.com/codevise/pageflow/pull/1888),
   [#1782](https://github.com/codevise/pageflow/pull/1782))
- Remove unused Devise helpers
  ([#2086](https://github.com/codevise/pageflow/pull/2086))

#### Paged Entry Type

##### Internal

- Explicitly require regnerator runtime
  ([#2076](https://github.com/codevise/pageflow/pull/2076))
- Build pageflow-paged-react with Rollup
  ([#2060](https://github.com/codevise/pageflow/pull/2060))

#### Scrolled Entry Type

##### Published Entry

- Honor user's reduced motion preference for backdrop animations
  ([#2125](https://github.com/codevise/pageflow/pull/2125))
- Cutoff modes
  ([#2115](https://github.com/codevise/pageflow/pull/2115),
   [#2117](https://github.com/codevise/pageflow/pull/2117))
- Improve text inline file rights
  ([#2102](https://github.com/codevise/pageflow/pull/2102))
- Bug fix: Add workaround for video scaling issue in iOS 17 below 17.4
  ([#2090](https://github.com/codevise/pageflow/pull/2090))
- Bug fix: Fix image gallery scrolling in editor on Safari
  ([#2088](https://github.com/codevise/pageflow/pull/2088))
- Bug fix: Prevent gap in background with parallax effect
  ([#2056](https://github.com/codevise/pageflow/pull/2056))

##### Editor

- Do not switch to section settings when adding section
  ([#2080](https://github.com/codevise/pageflow/pull/2080))
- Improve editable link component
  ([#2129](https://github.com/codevise/pageflow/pull/2129))
- Do not sync non-react widgets to scrolled state in editor
  ([#2119](https://github.com/codevise/pageflow/pull/2119))
- Allow hiding sections outside of editor
  ([#2116](https://github.com/codevise/pageflow/pull/2116))

##### Widgets

- Add translations menu to default navigation bar
  ([#2075](https://github.com/codevise/pageflow/pull/2075),
   [#2108](https://github.com/codevise/pageflow/pull/2108))
- Allow extending default navigation with custom components
  ([#2126](https://github.com/codevise/pageflow/pull/2126),
   [#2121](https://github.com/codevise/pageflow/pull/2121))
- Fix chapter scroller issue on Chrome 126 on OS X
  ([#2122](https://github.com/codevise/pageflow/pull/2122))

##### Content Elements

- Add TikTok content element
  ([#2095](https://github.com/codevise/pageflow/pull/2095))
- First iteration of Hotspot content element
  ([#2106](https://github.com/codevise/pageflow/pull/2106))
- Backdrop content elements
  ([#2093](https://github.com/codevise/pageflow/pull/2093))

##### Themes

- Add typography classes for external links
  ([#2124](https://github.com/codevise/pageflow/pull/2124))
- Also apply quote mark font family to text block quotes
  ([#2123](https://github.com/codevise/pageflow/pull/2123))
- External links improvements
  ([#2110](https://github.com/codevise/pageflow/pull/2110))
- Accent color palettes for default navigation
  ([#2104](https://github.com/codevise/pageflow/pull/2104))
- Add typography classes for different sizes of quote element
  ([#2097](https://github.com/codevise/pageflow/pull/2097))
- Add theme property for image gallery scroll button size
  ([#2089](https://github.com/codevise/pageflow/pull/2089))
- Additional theme options and properties
  ([#2077](https://github.com/codevise/pageflow/pull/2077))
- Fix hanging quote position in center-ragged layout
  ([#2057](https://github.com/codevise/pageflow/pull/2057))
- Add theme property to customize logo height in default navigation
  ([#2055](https://github.com/codevise/pageflow/pull/2055))

##### Rails Engine

- Pass real request object to additional seed callable
  ([#2128](https://github.com/codevise/pageflow/pull/2128))
- Add if and unless options to additional packs
  ([#2084](https://github.com/codevise/pageflow/pull/2084))
- Allow registering additional editor packs with stylesheets
  ([#2083](https://github.com/codevise/pageflow/pull/2083))

##### Internal

- Upgrade to Storybook 7
  ([#2066](https://github.com/codevise/pageflow/pull/2066))

See
[17-0-stable branch](https://github.com/codevise/pageflow/blob/17-0-stable/CHANGELOG.md)
for previous changes.
