# CHANGELOG

### Version 15.2.2

2020-07-15

[Compare changes](https://github.com/codevise/pageflow/compare/v15.2.1.0...v15.2.2)

- Fix dummy app generation with Thor 1.0
  ([#1526](https://github.com/codevise/pageflow/pull/1526))

### Version 15.2.1

2020-04-02

[Compare changes](https://github.com/codevise/pageflow/compare/v15.2.0...v15.2.1)

- Fix disabling home button input in account form based on theme (15.2 Backport)
  ([#1376](https://github.com/codevise/pageflow/pull/1376))
- Include scrolled content element js files in gem (15.2 Backport)
  ([#1374](https://github.com/codevise/pageflow/pull/1374))

### Version 15.2.0

2020-04-01

[Compare changes](https://github.com/codevise/pageflow/compare/15-1-stable...v15.2.0)

#### Core

##### Editor

- Bug fix: Re-add entry.configuration in editor for backwards compatibility
  ([#1331](https://github.com/codevise/pageflow/pull/1331))
- Bug fix: Fix help link in editor page type drop down
  ([#1372](https://github.com/codevise/pageflow/pull/1372))

##### Documentation

- Remind developers to configure their editor with ESLint before starting to contribute
  ([#1369](https://github.com/codevise/pageflow/pull/1369))
- Move troubleshooting to docs
  ([#1327](https://github.com/codevise/pageflow/pull/1327))

##### Internal

- Extract entry template from theming
  ([#1315](https://github.com/codevise/pageflow/pull/1315))
- Use Ruby 2.6.5 in Travis
  ([#1334](https://github.com/codevise/pageflow/pull/1334))
- Remove pageflow-react from yarn workspace list
  ([#1329](https://github.com/codevise/pageflow/pull/1329))

#### Paged Entry Type

##### Published Entry

- Allow hiding the logo on page level
  ([#1356](https://github.com/codevise/pageflow/pull/1356))
- Bug fix: Make multimedia alert and new pages box display again for
  new entries
  ([#1366](https://github.com/codevise/pageflow/pull/1366))

#### Scrolled Entry Type

##### Content Elements

- Add before/after content element
  ([#1351](https://github.com/codevise/pageflow/pull/1351))
- dataWrapperChart content element
  ([#1349](https://github.com/codevise/pageflow/pull/1349),
   [#1355](https://github.com/codevise/pageflow/pull/1355))
- External link content element
  ([#1346](https://github.com/codevise/pageflow/pull/1346))
- Add videoEmbed content element
  ([#1336](https://github.com/codevise/pageflow/pull/1336))

##### Widgets

- Improve navigation
  ([#1347](https://github.com/codevise/pageflow/pull/1347))

##### Editor

- Adding content elements
  ([#1337](https://github.com/codevise/pageflow/pull/1337))
- Edit content elements in the editor
  ([#1335](https://github.com/codevise/pageflow/pull/1335))
- Add inline help texts for scrolled editor
  ([#1353](https://github.com/codevise/pageflow/pull/1353))
- Add section editing options in editor sidebar
  ([#1363](https://github.com/codevise/pageflow/pull/1363))

##### JavaScript API

- Export useFile hook from scrolled frontend
  ([#1371](https://github.com/codevise/pageflow/pull/1371))
- Fix useFileRights hook
  ([#1357](https://github.com/codevise/pageflow/pull/1357))
- I18n for scrolled frontend
  ([#1342](https://github.com/codevise/pageflow/pull/1342))
- Content element frontend api
  ([#1324](https://github.com/codevise/pageflow/pull/1324))
- Enable registering content elements with default config
  ([#1354](https://github.com/codevise/pageflow/pull/1354),
   [#1360](https://github.com/codevise/pageflow/pull/1360))
- Introduce configuration editor groups in scrolled editor
  ([#1352](https://github.com/codevise/pageflow/pull/1352),
   [#1365](https://github.com/codevise/pageflow/pull/1365))
- Improve guides
  ([#1362](https://github.com/codevise/pageflow/pull/1362),
   [#1348](https://github.com/codevise/pageflow/pull/1348),
   [#1344](https://github.com/codevise/pageflow/pull/1344))

##### Internal

- Make package imports external by default in Rollup config
  ([#1341](https://github.com/codevise/pageflow/pull/1341))
- Make pageflow-scrolled Capybara specs less flaky
  ([#1339](https://github.com/codevise/pageflow/pull/1339))
- Prevent Percy from reporting different video loading progress
  ([#1343](https://github.com/codevise/pageflow/pull/1343))
- Enable React devtools in editor iframe
  ([#1338](https://github.com/codevise/pageflow/pull/1338))
- Setup Storybook for content element development
  ([#1326](https://github.com/codevise/pageflow/pull/1326))

See
[15-1-stable branch](https://github.com/codevise/pageflow/blob/15-1-stable/CHANGELOG.md)
for previous changes.
