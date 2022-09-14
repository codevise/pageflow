# CHANGELOG

### Version 15.7.1

2022-09-14

[Compare changes](https://github.com/codevise/pageflow/compare/v15.7.0...v15.7.1)

##### Security

- Fix
  [GHSA-qcqv-38jg-2r43](https://github.com/codevise/pageflow/security/advisories/GHSA-qcqv-38jg-2r43):
  Insecure direct object reference in membership update endpoint
  ([#1862](https://github.com/codevise/pageflow/pull/1862))
- Fix
  [GHSA-wrrw-crp8-979q](https://github.com/codevise/pageflow/security/advisories/GHSA-wrrw-crp8-979q):
  Sensitive user data extraction via Ransack query injection
  ([#1862](https://github.com/codevise/pageflow/pull/1862))

### Version 15.7.0

2022-07-18

[Compare changes](https://github.com/codevise/pageflow/compare/15-6-stable...v15.7.0)

#### Core

##### Rails Engine

- Allow skipping encoding confirmation
  ([#1824](https://github.com/codevise/pageflow/pull/1824))
- Allow disabling taking snapshots when acquiring an editor lock
  ([#1819](https://github.com/codevise/pageflow/pull/1819))
- Theme customization
  ([#1713](https://github.com/codevise/pageflow/pull/1713),
   [#1771](https://github.com/codevise/pageflow/pull/1771))
- Fix compatibility with JBuilder 2.11.3
  ([#1757](https://github.com/codevise/pageflow/pull/1757))
- Prevent exception when reusing file from deleted entry
  ([#1834](https://github.com/codevise/pageflow/pull/1834))

##### Admin

- Improve entry new form
  ([#1822](https://github.com/codevise/pageflow/pull/1822))
- Improve admin styles
  ([#1816](https://github.com/codevise/pageflow/pull/1816))
- Remove scrolling attribute from embed iframe snippet
  ([#1759](https://github.com/codevise/pageflow/pull/1759))
- Let admin filters entry admin by entry type
  ([#1756](https://github.com/codevise/pageflow/pull/1756))

##### Editor

- Rebrush editor UI
  ([#1809](https://github.com/codevise/pageflow/pull/1809))
- Improve supported host handling in url input
  ([#1741](https://github.com/codevise/pageflow/pull/1741))

##### Published Entry

- Use canonical entry url prefix in pretty urls
  ([#1752](https://github.com/codevise/pageflow/pull/1752))
- Support adding trailing slash to canonical entry urls
  ([#1833](https://github.com/codevise/pageflow/pull/1833))
- Support csmil HLS playlists
  ([#1817](https://github.com/codevise/pageflow/pull/1817))
- Load DASH on Android if hls-playlist host contains an underscore
  ([#1791](https://github.com/codevise/pageflow/pull/1791))
- Consent
  ([#1705](https://github.com/codevise/pageflow/pull/1705),
   [#1735](https://github.com/codevise/pageflow/pull/1735),
   [#1712](https://github.com/codevise/pageflow/pull/1712))

##### Internal

- Prevent full table scan in EntryRoleQuery::Scope
  ([#1758](https://github.com/codevise/pageflow/pull/1758))
- Upgrade Jest and Testing Library
  ([#1721](https://github.com/codevise/pageflow/pull/1721))

#### Paged Entry Type

##### Published Entry

- Add feature flag to use ultra image variant for paged backgrounds
  ([#1815](https://github.com/codevise/pageflow/pull/1815))
- Allow deactivating smart contain for video pages
  ([#1812](https://github.com/codevise/pageflow/pull/1812))
- Use large image variant for non-blurred media loading spinner
  ([#1769](https://github.com/codevise/pageflow/pull/1769))
- Consent and embed opt-in
  ([#1716](https://github.com/codevise/pageflow/pull/1716),
   [#1715](https://github.com/codevise/pageflow/pull/1715),
   [#1714](https://github.com/codevise/pageflow/pull/1714),
   [#1710](https://github.com/codevise/pageflow/pull/1710))

##### Themes

- Add theme option to display image on page shadow
  ([#1704](https://github.com/codevise/pageflow/pull/1704),
   [#1706](https://github.com/codevise/pageflow/pull/1706))
- Add theme option to change left position of logo
  ([#1707](https://github.com/codevise/pageflow/pull/1707))

#### Scrolled Entry Type

##### Rails Engine

- Additional frontend seed data
  ([#1799](https://github.com/codevise/pageflow/pull/1799),
   [#1801](https://github.com/codevise/pageflow/pull/1801))
- Improve guides for Pageflow Scrolled
  ([#1793](https://github.com/codevise/pageflow/pull/1793))
- Move guides for Pageflow Pageflow to entry type directory
  ([#1792](https://github.com/codevise/pageflow/pull/1792))
- Allow registering additional frontend/editor packs
  ([#1772](https://github.com/codevise/pageflow/pull/1772))
- Make Webpack load chunks via asset host
  ([#1753](https://github.com/codevise/pageflow/pull/1753),
   [#1754](https://github.com/codevise/pageflow/pull/1754))
- Allow transforming theme customizations
  ([#1746](https://github.com/codevise/pageflow/pull/1746))
- Allow passing traits to create_used_file
  ([#1742](https://github.com/codevise/pageflow/pull/1742))

##### Editor

- Make default section configurable and change default to fade
  ([#1760](https://github.com/codevise/pageflow/pull/1760),
   [#1761](https://github.com/codevise/pageflow/pull/1761))
- Always allow inserting all content element types
  ([#1740](https://github.com/codevise/pageflow/pull/1740))
- Allow moving text block ranges
  ([#1739](https://github.com/codevise/pageflow/pull/1739))
- Render fade transition check box in Firefox
  ([#1728](https://github.com/codevise/pageflow/pull/1728))

##### Published Entry

- Add centerRagged layout variant
  ([#1787](https://github.com/codevise/pageflow/pull/1787))
- Prevent shadow flickering while scrolling on iOS 14
  ([#1755](https://github.com/codevise/pageflow/pull/1755))
- Consent for scrolled entries
  ([#1722](https://github.com/codevise/pageflow/pull/1722))
- Transliterate German Umlauts in entry slugs
  ([#1720](https://github.com/codevise/pageflow/pull/1720))

##### Widgets

- Scrolled widget types
  ([#1749](https://github.com/codevise/pageflow/pull/1749))
- Do not convert SVG files uploaded as scrolled logo
  ([#1835](https://github.com/codevise/pageflow/pull/1835))
- Update highlighted chapter in navigation when scrolling
  ([#1836](https://github.com/codevise/pageflow/pull/1836))
- Allow placing widget in default navigation bar credit box
  ([#1828](https://github.com/codevise/pageflow/pull/1828))
- Do not pause loops when audio focus is lost
  ([#1827](https://github.com/codevise/pageflow/pull/1827))
- Fix unmute icon color in Safari
  ([#1808](https://github.com/codevise/pageflow/pull/1808))
- Ensure last item of mobile menu is visible on Android
  ([#1807](https://github.com/codevise/pageflow/pull/1807))
- Do not collapse navigation bar after iOS scroll bouncing
  ([#1806](https://github.com/codevise/pageflow/pull/1806))
- Align navigation breakpoints with theme breakpoints
  ([#1770](https://github.com/codevise/pageflow/pull/1770))

##### Content Elements

- Allow more position options for content elements
  ([#1745](https://github.com/codevise/pageflow/pull/1745))
- Add portrait image option to inline image
  ([#1744](https://github.com/codevise/pageflow/pull/1744))
- Allow defining custom poster for video embeds
  ([#1743](https://github.com/codevise/pageflow/pull/1743))
- Make external link id generation more robust
  ([#1802](https://github.com/codevise/pageflow/pull/1802))
- Server generated peak data for waveforms
  ([#1814](https://github.com/codevise/pageflow/pull/1814))
- Inline video loops and improved unmute options
  ([#1810](https://github.com/codevise/pageflow/pull/1810))
- Prevent displaying black lines at the side of FitViewport elements
  ([#1825](https://github.com/codevise/pageflow/pull/1825))
- Allow sorting items in external links content element
  ([#1800](https://github.com/codevise/pageflow/pull/1800))
- Apply consist max-width to wide elements
  ([#1798](https://github.com/codevise/pageflow/pull/1798))
- Add iframe embed content element
  ([#1762](https://github.com/codevise/pageflow/pull/1762),
   [#1765](https://github.com/codevise/pageflow/pull/1765))
- Display subtitles at the bottom of the media element
  ([#1764](https://github.com/codevise/pageflow/pull/1764))
- Add line break and manual hyphenation support for headings
  ([#1751](https://github.com/codevise/pageflow/pull/1751))
- Add feature flag to disable scrolled chart opt-in
  ([#1732](https://github.com/codevise/pageflow/pull/1732))
- Prevent interpreting external links as relative
  ([#1727](https://github.com/codevise/pageflow/pull/1727))
- Use lazy opt-in consent paradigm for scrolled embeds
  ([#1726](https://github.com/codevise/pageflow/pull/1726))
- Make heading text size configurable
  ([#1725](https://github.com/codevise/pageflow/pull/1725))
- Make it easier to recognize 360° images
  ([#1724](https://github.com/codevise/pageflow/pull/1724))
- Ensure contrast of text in embed opt-in
  ([#1723](https://github.com/codevise/pageflow/pull/1723))
- Remove option hide before/after handles
  ([#1719](https://github.com/codevise/pageflow/pull/1719))
- Fit viewport without displaying pillar boxes
  ([#1718](https://github.com/codevise/pageflow/pull/1718))
- Add missing translation for VR content element
  ([#1711](https://github.com/codevise/pageflow/pull/1711))

##### Themes

- Render typography CSS rules based on scrolled theme options
  ([#1750](https://github.com/codevise/pageflow/pull/1750))
- Allow rendering content elements with rounded corners.
  ([#1804](https://github.com/codevise/pageflow/pull/1804),
   [#1805](https://github.com/codevise/pageflow/pull/1805))
- Add content surface color properties
  ([#1803](https://github.com/codevise/pageflow/pull/1803))
- Restore spacing but make it theme configurable
- Allow configuring section widths in theme
  ([#1786](https://github.com/codevise/pageflow/pull/1786),
   [#1795](https://github.com/codevise/pageflow/pull/1795),
   [#1796](https://github.com/codevise/pageflow/pull/1796))
- Allow targeting different heading sizes via theme typography rules
  ([#1789](https://github.com/codevise/pageflow/pull/1789))
- Text variants
  ([#1788](https://github.com/codevise/pageflow/pull/1788))
- Allow changing content text color via theme options
  ([#1785](https://github.com/codevise/pageflow/pull/1785))
- Allow overriding text block heading margins in typography rules
  ([#1784](https://github.com/codevise/pageflow/pull/1784))
- Let themes customize navigation bar icons
  ([#1775](https://github.com/codevise/pageflow/pull/1775),
   [#1776](https://github.com/codevise/pageflow/pull/1776))
- More theme options for scrolled default navigation
  ([#1768](https://github.com/codevise/pageflow/pull/1768))

##### JavaScript API

- Make scrolled rendering test helpers available outside package
  ([#1818](https://github.com/codevise/pageflow/pull/1818))

##### Internal

- Fix storybook
  ([#1826](https://github.com/codevise/pageflow/pull/1826))
- Upgrade React minor version used in development
  ([#1773](https://github.com/codevise/pageflow/pull/1773))
- Transpile pageflow package in scrolled storybook
  ([#1717](https://github.com/codevise/pageflow/pull/1717))
- Update Video.js for SSR fix
  ([#1701](https://github.com/codevise/pageflow/pull/1701))
- Do not use import/export keywords in vendored deps
  ([#1700](https://github.com/codevise/pageflow/pull/1700))

See
[15-6-stable branch](https://github.com/codevise/pageflow/blob/15-6-stable/CHANGELOG.md)
for previous changes.
