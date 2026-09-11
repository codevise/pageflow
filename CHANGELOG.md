# CHANGELOG

### Version 17.2.0

2026-09-11

[Compare changes](https://github.com/codevise/pageflow/compare/17-1-stable...v17.2.0)

#### Core

##### Published Entry

- Support regional locales via i18n fallback chain
  ([#2416](https://github.com/codevise/pageflow/pull/2416),
   [#2417](https://github.com/codevise/pageflow/pull/2417))
- Bug fix: Clear stale permalink redirect on slug change
  ([#2403](https://github.com/codevise/pageflow/pull/2403))

##### Admin

- Persist selected folder when creating entries
  ([#2366](https://github.com/codevise/pageflow/pull/2366))
- Break permalink input but not inside base url
  ([#2328](https://github.com/codevise/pageflow/pull/2328))

##### Editor

- File management improvements with folders and bulk deletion
  ([#2465](https://github.com/codevise/pageflow/pull/2465),
   [#2466](https://github.com/codevise/pageflow/pull/2466),
   [#2467](https://github.com/codevise/pageflow/pull/2467),
   [#2471](https://github.com/codevise/pageflow/pull/2471),
   [#2475](https://github.com/codevise/pageflow/pull/2475))
- Debounce auto save for rapid config changes
  ([#2365](https://github.com/codevise/pageflow/pull/2365))
- Make TabsView implement tabslist role
  ([#2297](https://github.com/codevise/pageflow/pull/2297))
- Bug fix: Restore support for creating generated files without file name
  ([#2293](https://github.com/codevise/pageflow/pull/2293))

##### JavaScript API

- Trigger seeking/seeked media events
  ([#2413](https://github.com/codevise/pageflow/pull/2413))
- Allow disabling text area dynamically
  ([#2326](https://github.com/codevise/pageflow/pull/2326))

##### Rails Engine

- Support Rails 7.2, 8.0 and 8.1
  ([#2288](https://github.com/codevise/pageflow/pull/2288),
   [#2291](https://github.com/codevise/pageflow/pull/2291),
   [#2485](https://github.com/codevise/pageflow/pull/2485),
   [#2486](https://github.com/codevise/pageflow/pull/2486))
- Support for translated site attributes
  ([#2458](https://github.com/codevise/pageflow/pull/2458),
   [#2464](https://github.com/codevise/pageflow/pull/2464))
- Allow redirecting additional cnames to primary
  ([#2383](https://github.com/codevise/pageflow/pull/2383))
- Allow public_entry_redirect in feature blocks
  ([#2334](https://github.com/codevise/pageflow/pull/2334))
- Stop patching Resque to enqueue after transactions in install generator
  ([#2292](https://github.com/codevise/pageflow/pull/2292))

##### Test Helpers

- Add useFakeFeatures test helper
  ([#2434](https://github.com/codevise/pageflow/pull/2434))

##### Internal

- Speed up CI with pre-built Docker image
  ([#2397](https://github.com/codevise/pageflow/pull/2397))
- Make CI lint checks block on errors and warnings
  ([#2387](https://github.com/codevise/pageflow/pull/2387),
   [#2405](https://github.com/codevise/pageflow/pull/2405))
- Enforce documentation.yml toc coverage via ESLint
  ([#2435](https://github.com/codevise/pageflow/pull/2435))
- Unify helpers to test Backbone views with dom testing library
  ([#2295](https://github.com/codevise/pageflow/pull/2295))
- Use Ruby 3.4 and Node 22 in GitHub actions
  ([#2319](https://github.com/codevise/pageflow/pull/2319))
- Use polling for rollup watch mode
  ([#2400](https://github.com/codevise/pageflow/pull/2400))
- Update set-output syntax in GitHub actions
  ([#2307](https://github.com/codevise/pageflow/pull/2307))
- Pin connection_pool < 3
  ([#2330](https://github.com/codevise/pageflow/pull/2330))
- Bug fix: Only render homepage entry for HTML requests
  ([#2432](https://github.com/codevise/pageflow/pull/2432))

#### Scrolled Entry Type

##### Manual Update Steps

- Social embed content element
  ([#2312](https://github.com/codevise/pageflow/pull/2312))

##### Published Entry

- Excursions
  ([#2289](https://github.com/codevise/pageflow/pull/2289),
   [#2298](https://github.com/codevise/pageflow/pull/2298),
   [#2305](https://github.com/codevise/pageflow/pull/2305),
   [#2314](https://github.com/codevise/pageflow/pull/2314),
   [#2321](https://github.com/codevise/pageflow/pull/2321),
   [#2329](https://github.com/codevise/pageflow/pull/2329))
- Reduce and defer JavaScript payload
  ([#2445](https://github.com/codevise/pageflow/pull/2445),
   [#2446](https://github.com/codevise/pageflow/pull/2446),
   [#2447](https://github.com/codevise/pageflow/pull/2447),
   [#2448](https://github.com/codevise/pageflow/pull/2448))
- Inline file rights improvements
  ([#2478](https://github.com/codevise/pageflow/pull/2478),
   [#2482](https://github.com/codevise/pageflow/pull/2482))
- Outline/shadow element decorations and video element crop/rounded corners
  ([#2378](https://github.com/codevise/pageflow/pull/2378),
   [#2380](https://github.com/codevise/pageflow/pull/2380))
- Split appearance
  ([#2370](https://github.com/codevise/pageflow/pull/2370),
   [#2371](https://github.com/codevise/pageflow/pull/2371),
   [#2374](https://github.com/codevise/pageflow/pull/2374))
- Link buttons
  ([#2299](https://github.com/codevise/pageflow/pull/2299),
   [#2315](https://github.com/codevise/pageflow/pull/2315))
- Add responsive image srcset support
  ([#2367](https://github.com/codevise/pageflow/pull/2367))
- Improve accessibility of tooltips and player controls
  ([#2290](https://github.com/codevise/pageflow/pull/2290),
   [#2308](https://github.com/codevise/pageflow/pull/2308),
   [#2317](https://github.com/codevise/pageflow/pull/2317))
- Allow configuring gradient shadow color
  ([#2452](https://github.com/codevise/pageflow/pull/2452))
- Add option to position first backdrop below nav bar
  ([#2352](https://github.com/codevise/pageflow/pull/2352))
- Improve sticky position
  ([#2477](https://github.com/codevise/pageflow/pull/2477))
- Scroll margin
  ([#2376](https://github.com/codevise/pageflow/pull/2376))
- Allow using FAQPage strucured data type for entries
  ([#2306](https://github.com/codevise/pageflow/pull/2306))
- Opt in improvements
  ([#2323](https://github.com/codevise/pageflow/pull/2323),
   [#2369](https://github.com/codevise/pageflow/pull/2369))
- Add target top to external links in embed mode
  ([#2331](https://github.com/codevise/pageflow/pull/2331))
- Apply width restriction per item in TwoColumn
  ([#2384](https://github.com/codevise/pageflow/pull/2384))
- Prevent sub/sup from stretching line height
  ([#2454](https://github.com/codevise/pageflow/pull/2454))
- Load CSS custom property definitions globally
  ([#2373](https://github.com/codevise/pageflow/pull/2373))
- Do not enable scroll indicator widget by default if feature is enabled
  ([#2294](https://github.com/codevise/pageflow/pull/2294))
- Remove experimental frontend
  ([#2390](https://github.com/codevise/pageflow/pull/2390))
- Bug fix: Scroll to section when navigating via URL hash
  ([#2301](https://github.com/codevise/pageflow/pull/2301),
   [#2353](https://github.com/codevise/pageflow/pull/2353))
- Bug fix: Fix default text tracks on iOS
  ([#2300](https://github.com/codevise/pageflow/pull/2300))
- Bug fix: Do not pause background video when clicking in section margin
  ([#2296](https://github.com/codevise/pageflow/pull/2296))

##### Editor

- Custom section paddings and content element margins
  ([#2335](https://github.com/codevise/pageflow/pull/2335),
   [#2336](https://github.com/codevise/pageflow/pull/2336),
   [#2337](https://github.com/codevise/pageflow/pull/2337),
   [#2338](https://github.com/codevise/pageflow/pull/2338),
   [#2340](https://github.com/codevise/pageflow/pull/2340),
   [#2341](https://github.com/codevise/pageflow/pull/2341),
   [#2344](https://github.com/codevise/pageflow/pull/2344),
   [#2361](https://github.com/codevise/pageflow/pull/2361),
   [#2364](https://github.com/codevise/pageflow/pull/2364))
- Editing excursions
  ([#2318](https://github.com/codevise/pageflow/pull/2318),
   [#2320](https://github.com/codevise/pageflow/pull/2320),
   [#2322](https://github.com/codevise/pageflow/pull/2322),
   [#2345](https://github.com/codevise/pageflow/pull/2345),
   [#2349](https://github.com/codevise/pageflow/pull/2349))
- Entry and content element defaults
  ([#2342](https://github.com/codevise/pageflow/pull/2342),
   [#2350](https://github.com/codevise/pageflow/pull/2350),
   [#2451](https://github.com/codevise/pageflow/pull/2451))
- Actions menus
  ([#2346](https://github.com/codevise/pageflow/pull/2346),
   [#2347](https://github.com/codevise/pageflow/pull/2347),
   [#2348](https://github.com/codevise/pageflow/pull/2348))
- Motif improvements
  ([#2339](https://github.com/codevise/pageflow/pull/2339),
   [#2343](https://github.com/codevise/pageflow/pull/2343))
- Show in file list where files are referenced in configurations
  ([#2483](https://github.com/codevise/pageflow/pull/2483))
- Make UI design tokens available in preview
  ([#2393](https://github.com/codevise/pageflow/pull/2393))
- Support floating strategy and named portals for editable links
  ([#2358](https://github.com/codevise/pageflow/pull/2358))
- Support visibility and disabled bindings in sub views
  ([#2357](https://github.com/codevise/pageflow/pull/2357))
- Increase max length of link urls
  ([#2324](https://github.com/codevise/pageflow/pull/2324))
- Ensure preview text is visible in typography select
  ([#2381](https://github.com/codevise/pageflow/pull/2381))
- Fix inline image collapse when file is not ready
  ([#2379](https://github.com/codevise/pageflow/pull/2379))
- Fix text block selection rect on window resize
  ([#2377](https://github.com/codevise/pageflow/pull/2377))
- Fix add button hiding in style list
  ([#2363](https://github.com/codevise/pageflow/pull/2363))
- Fix editor crash for widgets disabled in editor
  ([#2449](https://github.com/codevise/pageflow/pull/2449))
- Bug fix: Leave content element route after delete
  ([#2484](https://github.com/codevise/pageflow/pull/2484))
- Bug fix: Prevent duplicate listeners in editor preview controller
  ([#2372](https://github.com/codevise/pageflow/pull/2372))
- Bug fix: Fix Slate error when deselecting text in Chrome
  ([#2354](https://github.com/codevise/pageflow/pull/2354))
- Bug fix: Improve section intersection observer
  ([#2333](https://github.com/codevise/pageflow/pull/2333))

##### Review

- Comments in preview and editor
  ([#2392](https://github.com/codevise/pageflow/pull/2392),
   [#2394](https://github.com/codevise/pageflow/pull/2394),
   [#2395](https://github.com/codevise/pageflow/pull/2395),
   [#2396](https://github.com/codevise/pageflow/pull/2396),
   [#2398](https://github.com/codevise/pageflow/pull/2398),
   [#2401](https://github.com/codevise/pageflow/pull/2401),
   [#2409](https://github.com/codevise/pageflow/pull/2409),
   [#2410](https://github.com/codevise/pageflow/pull/2410),
   [#2411](https://github.com/codevise/pageflow/pull/2411),
   [#2412](https://github.com/codevise/pageflow/pull/2412),
   [#2414](https://github.com/codevise/pageflow/pull/2414),
   [#2415](https://github.com/codevise/pageflow/pull/2415),
   [#2418](https://github.com/codevise/pageflow/pull/2418),
   [#2419](https://github.com/codevise/pageflow/pull/2419),
   [#2420](https://github.com/codevise/pageflow/pull/2420),
   [#2421](https://github.com/codevise/pageflow/pull/2421),
   [#2423](https://github.com/codevise/pageflow/pull/2423),
   [#2438](https://github.com/codevise/pageflow/pull/2438),
   [#2439](https://github.com/codevise/pageflow/pull/2439),
   [#2440](https://github.com/codevise/pageflow/pull/2440),
   [#2453](https://github.com/codevise/pageflow/pull/2453),
   [#2460](https://github.com/codevise/pageflow/pull/2460),
   [#2476](https://github.com/codevise/pageflow/pull/2476))
- Resolving comments
  ([#2399](https://github.com/codevise/pageflow/pull/2399))
- Unread comments
  ([#2474](https://github.com/codevise/pageflow/pull/2474))
- Editing comments and drafts
  ([#2457](https://github.com/codevise/pageflow/pull/2457),
   [#2462](https://github.com/codevise/pageflow/pull/2462))
- Preserve the wording each comment refers to
  ([#2456](https://github.com/codevise/pageflow/pull/2456))
- Allow hiding commenting UI
  ([#2441](https://github.com/codevise/pageflow/pull/2441),
   [#2479](https://github.com/codevise/pageflow/pull/2479))
- Remember collapsed state of comment toolbar
  ([#2463](https://github.com/codevise/pageflow/pull/2463))

##### Widgets

- Extend last section backdrop behind footer
  ([#2327](https://github.com/codevise/pageflow/pull/2327))
- Allow rendering DefaultNavigation with custom Menu
  ([#2311](https://github.com/codevise/pageflow/pull/2311))
- Do not display scroll indicator on top of consent bar
  ([#2325](https://github.com/codevise/pageflow/pull/2325))

##### Content Elements

- Lottie animation content element
  ([#2468](https://github.com/codevise/pageflow/pull/2468),
   [#2469](https://github.com/codevise/pageflow/pull/2469),
   [#2472](https://github.com/codevise/pageflow/pull/2472),
   [#2473](https://github.com/codevise/pageflow/pull/2473),
   [#2480](https://github.com/codevise/pageflow/pull/2480),
   [#2481](https://github.com/codevise/pageflow/pull/2481))
- Counter improvements
  ([#2302](https://github.com/codevise/pageflow/pull/2302),
   [#2355](https://github.com/codevise/pageflow/pull/2355),
   [#2356](https://github.com/codevise/pageflow/pull/2356))
- External link list improvements
  ([#2362](https://github.com/codevise/pageflow/pull/2362),
   [#2404](https://github.com/codevise/pageflow/pull/2404),
   [#2407](https://github.com/codevise/pageflow/pull/2407),
   [#2408](https://github.com/codevise/pageflow/pull/2408))
- Teaser list improvements
  ([#2313](https://github.com/codevise/pageflow/pull/2313),
   [#2316](https://github.com/codevise/pageflow/pull/2316))
- Waveform improvements
  ([#2359](https://github.com/codevise/pageflow/pull/2359),
   [#2360](https://github.com/codevise/pageflow/pull/2360))
- Add fullscreen option to inline video
  ([#2455](https://github.com/codevise/pageflow/pull/2455))
- Allow autoplaying inline videos only if entry is unmuted
  ([#2303](https://github.com/codevise/pageflow/pull/2303))
- Improve closing hotspot tooltips
  ([#2332](https://github.com/codevise/pageflow/pull/2332))
- Do not apply max-width to dynamically resized iframes
  ([#2375](https://github.com/codevise/pageflow/pull/2375))
- Increase iframe source url max length
  ([#2368](https://github.com/codevise/pageflow/pull/2368))
- Bug fix: Fix line breaks in info table cells
  ([#2309](https://github.com/codevise/pageflow/pull/2309))

##### Themes

- Theme presets background colors
  ([#2437](https://github.com/codevise/pageflow/pull/2437))
- Theme specific decoration effects
  ([#2424](https://github.com/codevise/pageflow/pull/2424))
- Allow theming figure caption padding, border and corners
  ([#2470](https://github.com/codevise/pageflow/pull/2470))
- Theme options for big play button and hotspots pager buttons
  ([#2304](https://github.com/codevise/pageflow/pull/2304))
- Support size-based typography for counters
  ([#2351](https://github.com/codevise/pageflow/pull/2351))

##### JavaScript API

- Improve media events
  ([#2382](https://github.com/codevise/pageflow/pull/2382),
   [#2450](https://github.com/codevise/pageflow/pull/2450))
- Support custom error boundaries for content elements
  ([#2310](https://github.com/codevise/pageflow/pull/2310))

##### Rails Engine

- Support declaring and preloading font faces in theme options
  ([#2459](https://github.com/codevise/pageflow/pull/2459),
   [#2461](https://github.com/codevise/pageflow/pull/2461))
- Let widgets contribute frontend packs
  ([#2442](https://github.com/codevise/pageflow/pull/2442),
   [#2443](https://github.com/codevise/pageflow/pull/2443),
   [#2444](https://github.com/codevise/pageflow/pull/2444))

##### Internal

- Turn inline editing decorators into general extensions API
  ([#2389](https://github.com/codevise/pageflow/pull/2389),
   [#2391](https://github.com/codevise/pageflow/pull/2391),
   [#2429](https://github.com/codevise/pageflow/pull/2429),
   [#2430](https://github.com/codevise/pageflow/pull/2430),
   [#2431](https://github.com/codevise/pageflow/pull/2431))
- Storybook workflow improvements
  ([#2402](https://github.com/codevise/pageflow/pull/2402),
   [#2422](https://github.com/codevise/pageflow/pull/2422),
   [#2433](https://github.com/codevise/pageflow/pull/2433))
- Feature specs for editable text and commenting
  ([#2426](https://github.com/codevise/pageflow/pull/2426),
   [#2427](https://github.com/codevise/pageflow/pull/2427),
   [#2428](https://github.com/codevise/pageflow/pull/2428))
- Improve consistency of scrolled's Jest test suite and document rules
  ([#2436](https://github.com/codevise/pageflow/pull/2436))
- Bundle entryState as a separate package export
  ([#2406](https://github.com/codevise/pageflow/pull/2406))
- Run specs without rebuilding packages
  ([#2385](https://github.com/codevise/pageflow/pull/2385),
   [#2386](https://github.com/codevise/pageflow/pull/2386))
- Align commenting loading
  ([#2425](https://github.com/codevise/pageflow/pull/2425))
- Rename widget_scope to entry_mode in template
  ([#2388](https://github.com/codevise/pageflow/pull/2388))

See
[17-1-stable branch](https://github.com/codevise/pageflow/blob/17-1-stable/CHANGELOG.md)
for previous changes.
