# CHANGELOG

### Version 15.4.0

2021-01-08

[Compare changes](https://github.com/codevise/pageflow/compare/15-3-stable...v15.4.0)

#### Core

##### Editor

- Improve editor styles
  ([#1629](https://github.com/codevise/pageflow/pull/1629))
- Bug fix: Wait for feature detection before booting editor
  ([#1573](https://github.com/codevise/pageflow/pull/1573))
- Bug fix: Work around Minicolors problem with updating swatches
  ([#1583](https://github.com/codevise/pageflow/pull/1583))

##### Internal

- String literals in SQL should only be enclosed by single quotes
  ([#1576](https://github.com/codevise/pageflow/pull/1576))
- Stub Paperclip by default in specs
  ([#1609](https://github.com/codevise/pageflow/pull/1609))
- Retry js specs of pageflow engine
  ([#1608](https://github.com/codevise/pageflow/pull/1608))
- Migrate Travis jobs to GitHub actions
  ([#1607](https://github.com/codevise/pageflow/pull/1607))
- Fix CI and abort when dummy app generation fails
  ([#1604](https://github.com/codevise/pageflow/pull/1604))

#### Paged Entry Type

##### Editor

- Fix classic loading spinner preview in editor
  ([#1649](https://github.com/codevise/pageflow/pull/1649))

#### Scrolled Entry Type

##### Published Entry

- Chapter deep linking
  ([#1637](https://github.com/codevise/pageflow/pull/1637))
- Lazy load DASH code for Scrolled
  ([#1635](https://github.com/codevise/pageflow/pull/1635))
- Deduplicate core-js in yarn.lock
  ([#1634](https://github.com/codevise/pageflow/pull/1634))
- Do not move backdrop when navigation is scrolled out of view
  ([#1632](https://github.com/codevise/pageflow/pull/1632))
- Navigation bar improvements
  ([#1631](https://github.com/codevise/pageflow/pull/1631))
- Do not fall back to file default motif area
  ([#1628](https://github.com/codevise/pageflow/pull/1628))
- Improve poster rendering
  ([#1621](https://github.com/codevise/pageflow/pull/1621))
- Optimize frontend rendering
  ([#1620](https://github.com/codevise/pageflow/pull/1620))
- Do not show scroll position based backdrop shadow initially
  ([#1619](https://github.com/codevise/pageflow/pull/1619))
- Prevent state update on unmounted component
  ([#1618](https://github.com/codevise/pageflow/pull/1618))
- Do not keep navigation open when focus is within
  ([#1617](https://github.com/codevise/pageflow/pull/1617))
- Improve unmute sequence
  ([#1615](https://github.com/codevise/pageflow/pull/1615))
- Show logo focus outline
  ([#1613](https://github.com/codevise/pageflow/pull/1613))
- Open logo link in new tab
  ([#1612](https://github.com/codevise/pageflow/pull/1612))
- Improve handling of untitled chapters
  ([#1610](https://github.com/codevise/pageflow/pull/1610))
- Logo link through theme option
  ([#1603](https://github.com/codevise/pageflow/pull/1603))
- Improve player controls
  ([#1602](https://github.com/codevise/pageflow/pull/1602),
   [#1586](https://github.com/codevise/pageflow/pull/1586))
- change Email to Mail
  ([#1601](https://github.com/codevise/pageflow/pull/1601))
- Prevent parallel playback of media elements
  ([#1599](https://github.com/codevise/pageflow/pull/1599))
- Improve navigation tooltips
  ([#1597](https://github.com/codevise/pageflow/pull/1597))
- Give backdrops default background color
  ([#1594](https://github.com/codevise/pageflow/pull/1594))
- Replace hard coded title and meta tags
  ([#1593](https://github.com/codevise/pageflow/pull/1593))
- Prevent resuming atmo of other section
  ([#1591](https://github.com/codevise/pageflow/pull/1591))
- Add toggle mute button to navigation
  ([#1589](https://github.com/codevise/pageflow/pull/1589))
- Implements skip link for navigation
  ([#1585](https://github.com/codevise/pageflow/pull/1585))
- Position backdrop image/video according to motif area
  ([#1582](https://github.com/codevise/pageflow/pull/1582))
- Add motif area support for background videos
  ([#1580](https://github.com/codevise/pageflow/pull/1580))
- Require user to opt in to see external embeds
  ([#1577](https://github.com/codevise/pageflow/pull/1577))
- Renders alt text for media
  ([#1574](https://github.com/codevise/pageflow/pull/1574))
- Use theme specific favicons
  ([#1569](https://github.com/codevise/pageflow/pull/1569))
- Bug fix: Don't remove media tag when unallocating player in IE 11
  ([#1648](https://github.com/codevise/pageflow/pull/1648))
- Allow disabling video or dash via browser feature flag
  ([#1647](https://github.com/codevise/pageflow/pull/1647))
- Bug fix: Ensure muted inline media pauses on deactivation
  ([#1646](https://github.com/codevise/pageflow/pull/1646))
- Bug fix: Fix for unstable navigation bar on Safari
  ([#1642](https://github.com/codevise/pageflow/pull/1642))
- Bug fix: Invisible share links should not be clickable
  ([#1641](https://github.com/codevise/pageflow/pull/1641))
- Bug fix: Play unmute sound on iOS
  ([#1640](https://github.com/codevise/pageflow/pull/1640))
- Bug fix: Fix scroll flickering on Android Chrome
  ([#1639](https://github.com/codevise/pageflow/pull/1639))
- Bug fix: Do not request new player when object position changes
  ([#1638](https://github.com/codevise/pageflow/pull/1638))
- Bug fix: Fix "SourceBuffer removed from parent media source" error
  ([#1636](https://github.com/codevise/pageflow/pull/1636))
- Bug fix: Prevent overlapping floated elements in centered layout
  ([#1590](https://github.com/codevise/pageflow/pull/1590))
- Bug fix: Fix progress indicator in scrolled navigation bar
  ([#1571](https://github.com/codevise/pageflow/pull/1571))

##### Content Elements

- Fix external links layout narrow screen sizes
  ([#1598](https://github.com/codevise/pageflow/pull/1598))
- Improve Datawrapper chart display
  ([#1611](https://github.com/codevise/pageflow/pull/1611))
- Never hide audio controls
  ([#1616](https://github.com/codevise/pageflow/pull/1616))
- Fixed before after height issue
  ([#1606](https://github.com/codevise/pageflow/pull/1606))
- Heading word-wrap and hyphen css
  ([#1605](https://github.com/codevise/pageflow/pull/1605))
- Fade out audio element when deactivating
  ([#1592](https://github.com/codevise/pageflow/pull/1592))
- Add caption and position options to chart element
  ([#1587](https://github.com/codevise/pageflow/pull/1587))
- Bug fix: BeforeAfter safari animation fix
  ([#1623](https://github.com/codevise/pageflow/pull/1623))

##### Editor

- Ordering content elements
  ([#1596](https://github.com/codevise/pageflow/pull/1596))
- Preserve scroll position when toggling phone preview
  ([#1614](https://github.com/codevise/pageflow/pull/1614))
- Show section settings directly when section is selected
  ([#1626](https://github.com/codevise/pageflow/pull/1626))
- Make motif area selection snap to grid
  ([#1578](https://github.com/codevise/pageflow/pull/1578))
- Extend german help texts
  ([#1625](https://github.com/codevise/pageflow/pull/1625))
- Add options for gradient opacity/motif area exposure
  ([#1624](https://github.com/codevise/pageflow/pull/1624))
- Add missing translation
  ([#1600](https://github.com/codevise/pageflow/pull/1600))
- Bug fix: Apply default configuration when adding to end of section
  ([#1630](https://github.com/codevise/pageflow/pull/1630))
- Bug fix: Fix error when merging empty text blocks
  ([#1588](https://github.com/codevise/pageflow/pull/1588))

###### JavaScript API

- Split isPrepared state into shouldLoad and shouldPrepare
  ([#1622](https://github.com/codevise/pageflow/pull/1622))

###### Internal

- Fix Jest warnings caused by Backbone XHR
  ([#1579](https://github.com/codevise/pageflow/pull/1579))
- Remove renderer memoization in development
  ([#1584](https://github.com/codevise/pageflow/pull/1584))
- Import scrolled translations into LocaleApp
  ([#1627](https://github.com/codevise/pageflow/pull/1627))
- Navigation bar Storybook story
  ([#1557](https://github.com/codevise/pageflow/pull/1557))
- Fix storybook documentation
  ([#1540](https://github.com/codevise/pageflow/pull/1540))

See
[15-3-stable branch](https://github.com/codevise/pageflow/blob/15-3-stable/CHANGELOG.md)
for previous changes.
