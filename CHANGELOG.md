# CHANGELOG

### Unreleased Changes

[Compare changes](https://github.com/codevise/pageflow/compare/17-0-stable...master)

#### Core

##### Published Entry

- Redirect after permalink change
  ([#2146](https://github.com/codevise/pageflow/pull/2146))
- Site root entry support with redirect and password protection
  ([#2251](https://github.com/codevise/pageflow/pull/2251),
   [#2255](https://github.com/codevise/pageflow/pull/2255),
   [#2256](https://github.com/codevise/pageflow/pull/2256))
- Custom 404 pages
  ([#2244](https://github.com/codevise/pageflow/pull/2244))
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
- Create configuration option for specifying a translator url
  ([#2153](https://github.com/codevise/pageflow/pull/2153))

##### Editor

- File management improvements with enhanced views and display names
  ([#2270](https://github.com/codevise/pageflow/pull/2270),
   [#2273](https://github.com/codevise/pageflow/pull/2273),
   [#2274](https://github.com/codevise/pageflow/pull/2274),
   [#2275](https://github.com/codevise/pageflow/pull/2275))
- Auto-orient images when determining dimensions
  ([#2113](https://github.com/codevise/pageflow/pull/2113))

##### JavaScript API

- Export and extend ColorSelectInputView
  ([#2198](https://github.com/codevise/pageflow/pull/2198))
- Add editor API to add additional appearance inputs
  ([#2197](https://github.com/codevise/pageflow/pull/2197))
- Improve media events
  ([#2070](https://github.com/codevise/pageflow/pull/2070),
   [#2071](https://github.com/codevise/pageflow/pull/2071))
- Pass entry model to additional editor initializers
  ([#2082](https://github.com/codevise/pageflow/pull/2082))

##### Rails Engine

- Clean up permalinks when deleting entries
  ([#2257](https://github.com/codevise/pageflow/pull/2257))
- Perma ID counter and revision component bulk copy
  ([#2267](https://github.com/codevise/pageflow/pull/2267))
- Allow entry specific public_entry_url_options
  ([#2213](https://github.com/codevise/pageflow/pull/2213))
- Require react-rails version that is compatible with Shakapacker
  ([#2276](https://github.com/codevise/pageflow/pull/2276))
- Support entry type specific editor translations for file types
  ([#2261](https://github.com/codevise/pageflow/pull/2261))
- Invoke hook when entry is created via admin
  ([#2078](https://github.com/codevise/pageflow/pull/2078))
- Extend version range to allow Resque 2
  ([#2054](https://github.com/codevise/pageflow/pull/2054))

##### Internal

- Fix publishing entry feature spec
  ([#2171](https://github.com/codevise/pageflow/pull/2171))
- Align DraftEntry#create_file! spec with real usage
  ([#2269](https://github.com/codevise/pageflow/pull/2269))
- Replace custom json_response helper with include_json matcher
  ([#2268](https://github.com/codevise/pageflow/pull/2268))
- Merge translations
  ([#2266](https://github.com/codevise/pageflow/pull/2266))
- Fix Rubocop offenses
  ([#2258](https://github.com/codevise/pageflow/pull/2258),
   [#2283](https://github.com/codevise/pageflow/pull/2283))
- Fix eslint setup
  ([#2248](https://github.com/codevise/pageflow/pull/2248))
- Do not depend in src icons in install generator
  ([#2260](https://github.com/codevise/pageflow/pull/2260))
- Upgrade cache action to v4
  ([#2210](https://github.com/codevise/pageflow/pull/2210))
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
- Vendor and fix wysihtml
  ([#2165](https://github.com/codevise/pageflow/pull/2165))
- Remove redundant pageflow namespaces in admin
  ([#2162](https://github.com/codevise/pageflow/pull/2162))

#### Paged Entry Type

##### Internal

- Explicitly require regnerator runtime
  ([#2076](https://github.com/codevise/pageflow/pull/2076))
- Build pageflow-paged-react with Rollup
  ([#2060](https://github.com/codevise/pageflow/pull/2060))

#### Scrolled Entry Type

##### Manual Update Step

- Support dark variant for widgets
  ([#2178](https://github.com/codevise/pageflow/pull/2178))

  Adapt themes to define colors via theme properties. You can use the
  [updated theme
  template](https://github.com/codevise/pageflow/pull/2178/files#diff-46b8b3195805f176a870a38aba142f219c3aba8167ede5a1627dd741648046e6)
  from the install generator as a reference.

##### Published Entry

- Workaround Chrome auto zoom animation bug
  ([#2132](https://github.com/codevise/pageflow/pull/2132))
- Prevent blurry background videos
  ([#2249](https://github.com/codevise/pageflow/pull/2249))
- Exclude ogg audio source on mobile Safari
  ([#2238](https://github.com/codevise/pageflow/pull/2238))
- Figure caption variants and text inline rights backdrops
  ([#2168](https://github.com/codevise/pageflow/pull/2168))
- Honor user's reduced motion preference for backdrop animations
  ([#2125](https://github.com/codevise/pageflow/pull/2125))
- Cutoff modes
  ([#2115](https://github.com/codevise/pageflow/pull/2115),
   [#2117](https://github.com/codevise/pageflow/pull/2117))
- Improve text inline file rights
  ([#2102](https://github.com/codevise/pageflow/pull/2102))
- Increase max length of alt texts to 5000
  ([#2206](https://github.com/codevise/pageflow/pull/2206))
- Add full width in phone layout option
  ([#2195](https://github.com/codevise/pageflow/pull/2195))
- Allow aligning narrow inline elements horizontally
  ([#2284](https://github.com/codevise/pageflow/pull/2284),
   [#2285](https://github.com/codevise/pageflow/pull/2285))
- Optimize display in Google Discover
  ([#2145](https://github.com/codevise/pageflow/pull/2145))
- Fix indentation of justified lists in center ragged sections
  ([#2214](https://github.com/codevise/pageflow/pull/2214),
   [#2215](https://github.com/codevise/pageflow/pull/2215))
- Prevent last section from extending beyond footer
  ([#2177](https://github.com/codevise/pageflow/pull/2177))
- Prevent tall stand-alone elements from breaking layout
  ([#2208](https://github.com/codevise/pageflow/pull/2208))
- Bug fix: Add workaround for video scaling issue in iOS 17 below 17.4
  ([#2090](https://github.com/codevise/pageflow/pull/2090))
- Bug fix: Fix image gallery scrolling in editor on Safari
  ([#2088](https://github.com/codevise/pageflow/pull/2088))
- Bug fix: Prevent gap in background with parallax effect
  ([#2056](https://github.com/codevise/pageflow/pull/2056))
- Experimental support for backdrop content elements
  ([#2093](https://github.com/codevise/pageflow/pull/2093))
- Experimental support for excursion chapters
  ([#2231](https://github.com/codevise/pageflow/pull/2231))

##### Editor

- Reorder chapters mode
  ([#2150](https://github.com/codevise/pageflow/pull/2150))
- Add undo/redo to inline editable texts
  ([#2163](https://github.com/codevise/pageflow/pull/2163))
- Add sub and sup marks to editable text
  ([#2141](https://github.com/codevise/pageflow/pull/2141))
- Add context menu item to copy section
  ([#2278](https://github.com/codevise/pageflow/pull/2278))
- Fix flickering when sorting sections after returning to the outline
  ([#2152](https://github.com/codevise/pageflow/pull/2152))
- Fix drag image of dragged section in Safari
  ([#2154](https://github.com/codevise/pageflow/pull/2154))
- Prevent text from overlapping list item edit button
  ([#2172](https://github.com/codevise/pageflow/pull/2172))
- Do not show cutoff mode indicator on newly created sections
  ([#2174](https://github.com/codevise/pageflow/pull/2174))
- Reset checkbox with undefined value when disabled binding changes
  ([#2264](https://github.com/codevise/pageflow/pull/2264))
- Make link preview align of editable link configurable
  ([#2218](https://github.com/codevise/pageflow/pull/2218))
- Prevent error when deleting content element with transient state
  ([#2200](https://github.com/codevise/pageflow/pull/2200))
- Do not switch to section settings when adding section
  ([#2080](https://github.com/codevise/pageflow/pull/2080))
- Improve editable link component
  ([#2129](https://github.com/codevise/pageflow/pull/2129))
- Do not sync non-react widgets to scrolled state in editor
  ([#2119](https://github.com/codevise/pageflow/pull/2119))
- Allow hiding sections outside of editor
  ([#2116](https://github.com/codevise/pageflow/pull/2116))
- Update Datawrapper create chart URL
  ([#2227](https://github.com/codevise/pageflow/pull/2227))
- Hide caption variants select if only one item
  ([#2181](https://github.com/codevise/pageflow/pull/2181))

##### Widgets

- Add scroll indicator widget
  ([#2202](https://github.com/codevise/pageflow/pull/2202))
- Allow overriding navigation bar logo settings via prop
  ([#2176](https://github.com/codevise/pageflow/pull/2176))
- Allow hiding chapters in navigation
  ([#2207](https://github.com/codevise/pageflow/pull/2207))
- Support opening logo url in same tab
  ([#2201](https://github.com/codevise/pageflow/pull/2201))
- Add translations menu to default navigation bar
  ([#2075](https://github.com/codevise/pageflow/pull/2075),
   [#2108](https://github.com/codevise/pageflow/pull/2108))
- Add Bluesky and Threads to sharing menu
  ([#2233](https://github.com/codevise/pageflow/pull/2233))
- Allow extending default navigation with custom components
  ([#2126](https://github.com/codevise/pageflow/pull/2126),
   [#2121](https://github.com/codevise/pageflow/pull/2121))
- Fix chapter scroller issue on Chrome 126 on OS X
  ([#2122](https://github.com/codevise/pageflow/pull/2122))

##### Content Elements

- Hotspots content element with pan/zoom mode and tooltips
  ([#2106](https://github.com/codevise/pageflow/pull/2106),
   [#2131](https://github.com/codevise/pageflow/pull/2131),
   [#2133](https://github.com/codevise/pageflow/pull/2133),
   [#2135](https://github.com/codevise/pageflow/pull/2135),
   [#2136](https://github.com/codevise/pageflow/pull/2136),
   [#2137](https://github.com/codevise/pageflow/pull/2137),
   [#2138](https://github.com/codevise/pageflow/pull/2138),
   [#2139](https://github.com/codevise/pageflow/pull/2139),
   [#2140](https://github.com/codevise/pageflow/pull/2140),
   [#2142](https://github.com/codevise/pageflow/pull/2142),
   [#2143](https://github.com/codevise/pageflow/pull/2143),
   [#2156](https://github.com/codevise/pageflow/pull/2156),
   [#2170](https://github.com/codevise/pageflow/pull/2170),
   [#2180](https://github.com/codevise/pageflow/pull/2180),
   [#2212](https://github.com/codevise/pageflow/pull/2212))
- Info table content element with color customization and responsive layouts
  ([#2182](https://github.com/codevise/pageflow/pull/2182),
   [#2185](https://github.com/codevise/pageflow/pull/2185),
   [#2187](https://github.com/codevise/pageflow/pull/2187),
   [#2189](https://github.com/codevise/pageflow/pull/2189),
   [#2192](https://github.com/codevise/pageflow/pull/2192),
   [#2193](https://github.com/codevise/pageflow/pull/2193),
   [#2205](https://github.com/codevise/pageflow/pull/2205),
   [#2281](https://github.com/codevise/pageflow/pull/2281),
   [#2282](https://github.com/codevise/pageflow/pull/2282))
- Teaser list enhancements with text positioning, scaling, and scroller mode
  ([#2188](https://github.com/codevise/pageflow/pull/2188),
   [#2220](https://github.com/codevise/pageflow/pull/2220),
   [#2221](https://github.com/codevise/pageflow/pull/2221),
   [#2222](https://github.com/codevise/pageflow/pull/2222),
   [#2223](https://github.com/codevise/pageflow/pull/2223),
   [#2224](https://github.com/codevise/pageflow/pull/2224),
   [#2226](https://github.com/codevise/pageflow/pull/2226),
   [#2240](https://github.com/codevise/pageflow/pull/2240),
   [#2242](https://github.com/codevise/pageflow/pull/2242),
   [#2263](https://github.com/codevise/pageflow/pull/2263),
   [#2265](https://github.com/codevise/pageflow/pull/2265),
   [#2173](https://github.com/codevise/pageflow/pull/2173),
   [#2184](https://github.com/codevise/pageflow/pull/2184),
   [#2280](https://github.com/codevise/pageflow/pull/2280))
- Content element position "side"
  ([#2186](https://github.com/codevise/pageflow/pull/2186))
- Pagination and portrait images for image galleries
  ([#2217](https://github.com/codevise/pageflow/pull/2217))
- Add option to hide image gallery peeks
  ([#2216](https://github.com/codevise/pageflow/pull/2216))
- Make VR Image aspect ratio configurable with portrait override
  ([#2243](https://github.com/codevise/pageflow/pull/2243))
- Add option to resize iframe embed based on message sent from embed
  ([#2203](https://github.com/codevise/pageflow/pull/2203))
- Allow disabling thousands separators in counter
  ([#2211](https://github.com/codevise/pageflow/pull/2211))
- Support justified text align inside text blocks
  ([#2179](https://github.com/codevise/pageflow/pull/2179))
- Add TikTok content element
  ([#2095](https://github.com/codevise/pageflow/pull/2095))
- Make sound disclaimer texts configurable
  ([#2194](https://github.com/codevise/pageflow/pull/2194))

##### Themes

- Typography enhancements with sizing options and text effects
  ([#2191](https://github.com/codevise/pageflow/pull/2191),
   [#2204](https://github.com/codevise/pageflow/pull/2204),
   [#2225](https://github.com/codevise/pageflow/pull/2225))
- Use theme icons for default navigation scroll buttons
  ([#2127](https://github.com/codevise/pageflow/pull/2127))
- Add theme properties for default navigation bar buttons
  ([#2134](https://github.com/codevise/pageflow/pull/2134))
- Improve support for theme icons
  ([#2159](https://github.com/codevise/pageflow/pull/2159))
- Make custom icon directory name configurable via theme options
  ([#2160](https://github.com/codevise/pageflow/pull/2160))
- Support referencing theme assets from shared theme directory
  ([#2161](https://github.com/codevise/pageflow/pull/2161))
- Add theme option to display caption above
  ([#2250](https://github.com/codevise/pageflow/pull/2250))
- Rounded circle image modifier styles
  ([#2247](https://github.com/codevise/pageflow/pull/2247))
- Section paddings
  ([#2246](https://github.com/codevise/pageflow/pull/2246))
- Content element margins
  ([#2245](https://github.com/codevise/pageflow/pull/2245))
- Theme aspect ratios
  ([#2241](https://github.com/codevise/pageflow/pull/2241))
- Allow scaling backdrop to cover section instead of viewport
  ([#2239](https://github.com/codevise/pageflow/pull/2239))
- Make content margin configurable for narrow sections
  ([#2235](https://github.com/codevise/pageflow/pull/2235))
- Backdrop decoration effects
  ([#2234](https://github.com/codevise/pageflow/pull/2234))
- Let themes change content margin
  ([#2232](https://github.com/codevise/pageflow/pull/2232))
- Allow setting different border radius for full width elements
  ([#2230](https://github.com/codevise/pageflow/pull/2230))
- Custom card and palette colors
  ([#2229](https://github.com/codevise/pageflow/pull/2229))
- Fix typo in hyphens none rule
  ([#2219](https://github.com/codevise/pageflow/pull/2219))
- Let themes opt out of fit viewport logic
  ([#2262](https://github.com/codevise/pageflow/pull/2262))
- Allow including additional theme customization files in seed data
  ([#2209](https://github.com/codevise/pageflow/pull/2209))
- Pass PublishedEntry when transforming theme customization overrides
  ([#2196](https://github.com/codevise/pageflow/pull/2196))
- Add scopes for light and dark content
  ([#2199](https://github.com/codevise/pageflow/pull/2199))
- Ignore text nodes with types
  ([#2287](https://github.com/codevise/pageflow/pull/2287))
- Ignore empty palette color
  ([#2286](https://github.com/codevise/pageflow/pull/2286))
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

- Include missing JS file from scrolled package in gem
  ([#2277](https://github.com/codevise/pageflow/pull/2277))
- Add classnames as dependency of pageflow-scrolled
  ([#2259](https://github.com/codevise/pageflow/pull/2259))
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
