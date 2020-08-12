# CHANGELOG

### Unreleased Changes

[Compare changes](https://github.com/codevise/pageflow/compare/15-2-stable...master)

#### Core

##### Manual Update Step

- Entry types must now be registered in the host application
  ([#1556](https://github.com/codevise/pageflow/pull/1556))

  Add the following line to the top of your `pageflow` initializer:

  ```ruby
    config.plugin(PageflowPaged.plugin)
  ```

  If you are already using the experimental Scrolled entry type, also
  add:

  ```ruby
    config.plugin(PageflowScrolled.plugin)
  ```

- Install and run migrations.

##### Admin

- Make entry templates editable
  ([#1420](https://github.com/codevise/pageflow/pull/1420))
- Bug fix: Repair user invite form for admin users
  ([#1399](https://github.com/codevise/pageflow/pull/1399))
- Bug fix: Fix disabling home button input in account form based on theme
  ([#1375](https://github.com/codevise/pageflow/pull/1375))

##### Editor

- Default to empty link url in text area input view
  ([#1549](https://github.com/codevise/pageflow/pull/1549))
- Bug fix: Hide vertical scroll bar in editor sidebar
  ([#1479](https://github.com/codevise/pageflow/pull/1479))

##### JavaScript API

- Media-API
  ([#1394](https://github.com/codevise/pageflow/pull/1394))
- Extend editor api to detect browser
  ([#1510](https://github.com/codevise/pageflow/pull/1510))
- Add logic to detect IOS 13 Safari on iPad
  ([#1519](https://github.com/codevise/pageflow/pull/1519))
- Extend the existing user agent detection code for desktop browsers
  ([#1512](https://github.com/codevise/pageflow/pull/1512))

##### Documentation

- Add troubleshooting section to Rails Engine Development docs
  ([#1397](https://github.com/codevise/pageflow/pull/1397))

##### Internal

- Decouple frontend from jquery and backbone
  ([#1396](https://github.com/codevise/pageflow/pull/1396),
   [#1480](https://github.com/codevise/pageflow/pull/1480))
- Update edge script
  ([#1402](https://github.com/codevise/pageflow/pull/1402))
- Fix dummy app generation with Thor 1.0
  ([#1522](https://github.com/codevise/pageflow/pull/1522))
- Add inline documentation to membership admin
  ([#1425](https://github.com/codevise/pageflow/pull/1425))
- No longer pin chrome driver in scrolled Capybara specs
  ([#1380](https://github.com/codevise/pageflow/pull/1380))

#### Paged Entry Type

##### Published Entry

- Loading spinner configurable animation time
  ([#1481](https://github.com/codevise/pageflow/pull/1481))
- Loading spinner image positioning
  ([#1378](https://github.com/codevise/pageflow/pull/1378))

##### Internal

- Rename pageflow-react to pageflow-paged-react
  ([#1387](https://github.com/codevise/pageflow/pull/1387))
- Update package path in jshintignore
  ([#1395](https://github.com/codevise/pageflow/pull/1395))
- Refactor and move paged specific js from pageflow/frontend to pageflow-paged/frontend package
  ([#1370](https://github.com/codevise/pageflow/pull/1370))
- Rewrite build scripts to use gemspec files
  ([#1415](https://github.com/codevise/pageflow/pull/1415))

#### Scrolled Entry Type

##### Admin

- Create scrolled entries
  ([#1361](https://github.com/codevise/pageflow/pull/1361))

##### Published Entry

- Server side rendering for scrolled entries
  ([#1552](https://github.com/codevise/pageflow/pull/1552),
   [#1551](https://github.com/codevise/pageflow/pull/1551))
- Add meta tags in scrolled
  ([#1539](https://github.com/codevise/pageflow/pull/1539))
- Make link color match inverted text color
  ([#1516](https://github.com/codevise/pageflow/pull/1516))
- Atmo for scrolled entries
  ([#1500](https://github.com/codevise/pageflow/pull/1500),
   [#1531](https://github.com/codevise/pageflow/pull/1531))
- Only show focus outline after keyboard input
  ([#1503](https://github.com/codevise/pageflow/pull/1503),
   [#1508](https://github.com/codevise/pageflow/pull/1508))
- Improve cards appearance variant
  ([#1507](https://github.com/codevise/pageflow/pull/1507),
   [#1517](https://github.com/codevise/pageflow/pull/1517),
   [#1477](https://github.com/codevise/pageflow/pull/1477))
- Improve gradient shadow appearance variant
  ([#1487](https://github.com/codevise/pageflow/pull/1487),
   [#1483](https://github.com/codevise/pageflow/pull/1483),
   [#1478](https://github.com/codevise/pageflow/pull/1478))
- Use consistent margins around content elements
  ([#1476](https://github.com/codevise/pageflow/pull/1476))
- Media Blessed Player Pool
  ([#1452](https://github.com/codevise/pageflow/pull/1452),
   [#1474](https://github.com/codevise/pageflow/pull/1474))
- Ensure empty paragraphs have height
  ([#1468](https://github.com/codevise/pageflow/pull/1468))
- Support headings of different levels
  ([#1364](https://github.com/codevise/pageflow/pull/1364))
- Improve Backdrop videos
  ([#1461](https://github.com/codevise/pageflow/pull/1461),
   [#1454](https://github.com/codevise/pageflow/pull/1454),
   [#1441](https://github.com/codevise/pageflow/pull/1441),
   [#1534](https://github.com/codevise/pageflow/pull/1534))
- Mute media in background
  ([#1521](https://github.com/codevise/pageflow/pull/1521))
- Improve Safari/IE 11 compatibility of reveal transitions
  ([#1391](https://github.com/codevise/pageflow/pull/1391))
- Install polyfills to make scrolled frontend work in IE 11
  ([#1389](https://github.com/codevise/pageflow/pull/1389))
- Bug fix: Prevent display of horizontal scroll bar
  ([#1464](https://github.com/codevise/pageflow/pull/1464))

##### Content Elements

- Responsive Datawrapper chart height
  ([#1533](https://github.com/codevise/pageflow/pull/1533),
   [#1547](https://github.com/codevise/pageflow/pull/1547))
- Fix heading default value logic
  ([#1536](https://github.com/codevise/pageflow/pull/1536))
- Improve inline media
  ([#1523](https://github.com/codevise/pageflow/pull/1523))
- Display text tracks in inline videos and audios
  ([#1502](https://github.com/codevise/pageflow/pull/1502))
- Add quality menu to inline video player controls
  ([#1497](https://github.com/codevise/pageflow/pull/1497))
- Menus and accessibily improvements for player controls
  ([#1496](https://github.com/codevise/pageflow/pull/1496))
- Add text tracks menu to player controls
  ([#1501](https://github.com/codevise/pageflow/pull/1501))
- Prevent progress bar with more than 100%
  ([#1515](https://github.com/codevise/pageflow/pull/1515))
- Fix segfault on media playback in Chrome
  ([#1511](https://github.com/codevise/pageflow/pull/1511))
- Display black poster in empty inline video
  ([#1506](https://github.com/codevise/pageflow/pull/1506))
- Make player controls visible on boxes
  ([#1505](https://github.com/codevise/pageflow/pull/1505))
- Use active quality in VideoPlayer
  ([#1504](https://github.com/codevise/pageflow/pull/1504))
- Display pillar boxes for full width inline images
  ([#1471](https://github.com/codevise/pageflow/pull/1471))
- Use smaller variants for inline images
  ([#1466](https://github.com/codevise/pageflow/pull/1466))
- Lazy load inline images
  ([#1465](https://github.com/codevise/pageflow/pull/1465))
- Inline audio with posterframe
  ([#1457](https://github.com/codevise/pageflow/pull/1457))
- Display black pillar boxes for full width embed videos
  ([#1456](https://github.com/codevise/pageflow/pull/1456))
- Use lifecycle hook in media content elements
  ([#1458](https://github.com/codevise/pageflow/pull/1458))
- Improve video embed content element
  ([#1450](https://github.com/codevise/pageflow/pull/1450))
- Chart content element fixes
  ([#1449](https://github.com/codevise/pageflow/pull/1449))
- External links fixes
  ([#1447](https://github.com/codevise/pageflow/pull/1447))
- Added placeholder images for before/after
  ([#1445](https://github.com/codevise/pageflow/pull/1445))
- Replace useOnScreen with useContentElementLifecycle in before/after
  ([#1451](https://github.com/codevise/pageflow/pull/1451))
- Remove css custom properties in before/after
  ([#1436](https://github.com/codevise/pageflow/pull/1436))
- Give height to element in case of no images
  ([#1435](https://github.com/codevise/pageflow/pull/1435))
- Delay label fadeout on mousedown/touchstart
  ([#1434](https://github.com/codevise/pageflow/pull/1434))
- Removed label dependency for before/after
  ([#1433](https://github.com/codevise/pageflow/pull/1433))
- Player controls component
  ([#1400](https://github.com/codevise/pageflow/pull/1400))
- Hide player controls after timeout for full width content elements
  ([#1472])(https://github.com/codevise/pageflow/pull/1472)

##### Editor

- Add blank slate for scrolled entries
  ([#1550](https://github.com/codevise/pageflow/pull/1550))
- Add phone emulation mode to scrolled editor
  ([#1340](https://github.com/codevise/pageflow/pull/1340))
- Preview thumbnails for section transitions
  ([#1499](https://github.com/codevise/pageflow/pull/1499),
   [#1470](https://github.com/codevise/pageflow/pull/1470))
- Support inserting text links
  ([#1443](https://github.com/codevise/pageflow/pull/1443),
   [#1524](https://github.com/codevise/pageflow/pull/1524))
- Improve section defaults
  ([#1469](https://github.com/codevise/pageflow/pull/1469))
- Display insert button when section is selected
  ([#1486](https://github.com/codevise/pageflow/pull/1486))
- Hide background position option for inline image
  ([#1548](https://github.com/codevise/pageflow/pull/1548))
- Wrap content elements in error boundary
  ([#1535](https://github.com/codevise/pageflow/pull/1535))
- Render placeholder for content element of missing type
  ([#1406](https://github.com/codevise/pageflow/pull/1406))
- Inline text editing
  ([#1410](https://github.com/codevise/pageflow/pull/1410),
   [#1529](https://github.com/codevise/pageflow/pull/1529),
   [#1408](https://github.com/codevise/pageflow/pull/1408),
   [#1546](https://github.com/codevise/pageflow/pull/1546))
- Display content element type selection in dialog
  ([#1407](https://github.com/codevise/pageflow/pull/1407))
- Improve section handling in editor
  ([#1473](https://github.com/codevise/pageflow/pull/1473))
- Allow selecting processing images
  ([#1514](https://github.com/codevise/pageflow/pull/1514))
- Separate scrolled and paged help entries
  ([#1527](https://github.com/codevise/pageflow/pull/1527))
- Debounce saving editable text also when rerendered
  ([#1485](https://github.com/codevise/pageflow/pull/1485))
- Modify browser not supported view and make it responsive.
  ([#1513](https://github.com/codevise/pageflow/pull/1513))
- Fix external link file selection handler referer
  ([#1467](https://github.com/codevise/pageflow/pull/1467))
- Add imageMobile configuration for section
  ([#1459](https://github.com/codevise/pageflow/pull/1459))
- Make delete button remove text block elements
  ([#1440](https://github.com/codevise/pageflow/pull/1440))
- Allow overriding 100vh height of Fullscreen component
  ([#1438](https://github.com/codevise/pageflow/pull/1438))
- Allow editing motif areas in scrolled editor
  ([#1430](https://github.com/codevise/pageflow/pull/1430),
   [#1463](https://github.com/codevise/pageflow/pull/1463),
   [#1544](https://github.com/codevise/pageflow/pull/1544))
- Handle available section transitions
  ([#1428](https://github.com/codevise/pageflow/pull/1428))
- Inline editing for section and transtions
  ([#1427](https://github.com/codevise/pageflow/pull/1427))

##### Engine Config

- Theme specific navigation logo for scrolled entries
  ([#1554](https://github.com/codevise/pageflow/pull/1554))
- Widgets for scrolled entries
  ([#1446](https://github.com/codevise/pageflow/pull/1446),
   [#1532](https://github.com/codevise/pageflow/pull/1532))

##### JavaScript API

- Turn react and react-dom into peer dependencies of pageflow-scrolled
  ([#1545](https://github.com/codevise/pageflow/pull/1545))
- React media api
  ([#1398](https://github.com/codevise/pageflow/pull/1398))
- Improve handling of light and dark backgrounds
  ([#1509](https://github.com/codevise/pageflow/pull/1509))
- Viewport dependent pillar boxes
  ([#1442](https://github.com/codevise/pageflow/pull/1442))
- Add useContentElementLifecycle hook
  ([#1444](https://github.com/codevise/pageflow/pull/1444))
- Add useContentElementEditorState hook
  ([#1439](https://github.com/codevise/pageflow/pull/1439))
- Make useEntryStructure/useSectionStructure hooks private
  ([#1431](https://github.com/codevise/pageflow/pull/1431))
- Add supportedPositions option for content element types
  ([#1429](https://github.com/codevise/pageflow/pull/1429))
- Let content elements update their own configuration
  ([#1424](https://github.com/codevise/pageflow/pull/1424))
- Media player state hook
  ([#1412](https://github.com/codevise/pageflow/pull/1412))
- Media player context data
  ([#1520](https://github.com/codevise/pageflow/pull/1520))

##### Internal

- Provide locale via separate context
  ([#1492](https://github.com/codevise/pageflow/pull/1492))
- Add story to test media autoplay
  ([#1525](https://github.com/codevise/pageflow/pull/1525))
- Use empty inline images in appearance stories
  ([#1518](https://github.com/codevise/pageflow/pull/1518))
- Remove unused CSS
  ([#1488](https://github.com/codevise/pageflow/pull/1488))
- Sync entry metadata model into entry state
  ([#1530](https://github.com/codevise/pageflow/pull/1530))
- Decompose Entry spec into feature specs
  ([#1482](https://github.com/codevise/pageflow/pull/1482))
- Add stories for appearance/layout/positions
  ([#1475](https://github.com/codevise/pageflow/pull/1475))
- Introduce fakeMedia test helpers
  ([#1460](https://github.com/codevise/pageflow/pull/1460))
- Hide Datawrapper chart in Percy snapshot
  ([#1448](https://github.com/codevise/pageflow/pull/1448))
- Make scrolled API respond with no content for PUT/DELETE
  ([#1423](https://github.com/codevise/pageflow/pull/1423))
- Ignore new records in watchCollection
  ([#1422](https://github.com/codevise/pageflow/pull/1422))
- Use batch action to destroy content elements
  ([#1421](https://github.com/codevise/pageflow/pull/1421))
- Add batch endpoint to edit content elements
  ([#1403](https://github.com/codevise/pageflow/pull/1403))
- Enable scrolled entry type for storybook seed
  ([#1419](https://github.com/codevise/pageflow/pull/1419))
- Update Babel preset to fix duplicate helpers in build output
  ([#1413](https://github.com/codevise/pageflow/pull/1413))
- Memoize section properties
  ([#1409](https://github.com/codevise/pageflow/pull/1409))
- Lazy load inline editing components in editor
  ([#1404](https://github.com/codevise/pageflow/pull/1404))
- Publish pageflow-scrolled storybook via Travis
  ([#1393](https://github.com/codevise/pageflow/pull/1393),
   [#1392](https://github.com/codevise/pageflow/pull/1392))
- Decouple scrolled editor from paged frontend code
  ([#1385](https://github.com/codevise/pageflow/pull/1385))
- Add stories for section transitions
  ([#1390](https://github.com/codevise/pageflow/pull/1390))
- Add audio file reference in storybook seed tasks
  ([#1382](https://github.com/codevise/pageflow/pull/1382))
- Abort and retry scrolled Capybara specs when Chromedriver hangs
  ([#1383](https://github.com/codevise/pageflow/pull/1383))
- Seed data integration for audio files
  ([#1377](https://github.com/codevise/pageflow/pull/1377))
- Include scrolled content element js files in gem
  ([#1373](https://github.com/codevise/pageflow/pull/1373))
- Entry state integration for video files
  ([#1345](https://github.com/codevise/pageflow/pull/1345))
- Use files in CI/storybook seed
  ([#1401])(https://github.com/codevise/pageflow/pull/1401)

See
[15-2-stable branch](https://github.com/codevise/pageflow/blob/15-2-stable/CHANGELOG.md)
for previous changes.
