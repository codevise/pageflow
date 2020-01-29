# CHANGELOG

### Version 15.1.0.beta5

2020-01-29

[Compare changes](https://github.com/codevise/pageflow/compare/v15.1.0.beta4...v15.1.0.beta5)

Include `pageflow` and `pageflow-scrolled` packages in gem to allow a
host application setup where Yarn uses packages from the gem directory
managed by bundler.

### Version 15.1.0.beta4

2020-01-29

[Compare changes](https://github.com/codevise/pageflow/compare/v15.1.0.beta3...v15.1.0.beta4)

Forgot to build assets before doing previous release.

### Version 15.1.0.beta3

2020-01-29

[Compare changes](https://github.com/codevise/pageflow/compare/v15.1.0.beta2...v15.1.0.beta3)

#### Core

##### Host Application

- Updated Active Admin to 2.5.0
  ([#1280](https://github.com/codevise/pageflow/pull/1280))

  Starting with Active Admin 2.0, using `unshift` (or any other
  mutating method) to add load paths no longer work reliably (see
  [activeadmin/activeadmin#5995](https://github.com/activeadmin/activeadmin/issues/5995).
  Apply the following change to your host application's
  `active_admin.rb` initializer:

  ```diff
  - ActiveAdmin.application.unshift(Pageflow.active_admin_load_path)
  + ActiveAdmin.application.load_paths +=[Pageflow.active_admin_load_path]
  ```

- Improve support for Webpack setup in host appplication
  ([#1276](https://github.com/codevise/pageflow/pull/1276),
   [#1279](https://github.com/codevise/pageflow/pull/1279))

##### Admin

- Improve add member button
  ([#1195](https://github.com/codevise/pageflow/pull/1195))

##### Editor

- Bug fix: Prevent including pageflow/ui in pageflow/editor
  ([#1309](https://github.com/codevise/pageflow/pull/1309))

##### Engine Config

- Render entry type specific editor seed data
  ([#1265](https://github.com/codevise/pageflow/pull/1265))
- Entry type specific editor views
  ([#1262](https://github.com/codevise/pageflow/pull/1262))
- Entry type specific editor assets
  ([#1257](https://github.com/codevise/pageflow/pull/1257))
- Let entry types provide frontend apps to render entries
  ([#1254](https://github.com/codevise/pageflow/pull/1254),
   [#1255](https://github.com/codevise/pageflow/pull/1255))
- Extend config DSL for entry types
  ([#1267](https://github.com/codevise/pageflow/pull/1267))
- Allow scoping file types and widget types by entry types
  ([#1283](https://github.com/codevise/pageflow/pull/1283))
- Decouple revision components and file types from page types
  ([#1256](https://github.com/codevise/pageflow/pull/1256),
   [#1259](https://github.com/codevise/pageflow/pull/1259))
- Consider feature flags for file types available in editor
  ([#1275](https://github.com/codevise/pageflow/pull/1275))
- Extract part of appearance options into paged entry type
  ([#1304](https://github.com/codevise/pageflow/pull/1304))
- Scope existing built ins to paged entry type
  ([#1296](https://github.com/codevise/pageflow/pull/1296))
- Integrate entry type specific config with feature flags
  ([#1295](https://github.com/codevise/pageflow/pull/1295))
- Decouple editor layout
  ([#1284](https://github.com/codevise/pageflow/pull/1284))
- Let entry types define editor controllers
  ([#1271](https://github.com/codevise/pageflow/pull/1271))

##### File Importers

- Mentioned that file importer should be registered in a feature flag
  ([#1266](https://github.com/codevise/pageflow/pull/1266))
- File import feature flag
  ([#1258](https://github.com/codevise/pageflow/pull/1258))
- Bug fix: Minor file import lint change
  ([#1269](https://github.com/codevise/pageflow/pull/1269))

#### Paged Entry Type

##### Editor

- Bug fix: Fix page selection view
  ([#1281](https://github.com/codevise/pageflow/pull/1281))

##### Published Entry

- Bug fix: Invalidate page partial cache on locale change
  ([#1311](https://github.com/codevise/pageflow/pull/1311))
- Bug fix: Do not prefix partial paths with pageflow_paged
  ([#1320](https://github.com/codevise/pageflow/pull/1320))
- Bug fix: Fix `link_to home_button` raises URLGenerationError
  ([#1310](https://github.com/codevise/pageflow/pull/1310))

##### Internal

- Move PagedEntriesController to paged entry type engine
  ([#1285](https://github.com/codevise/pageflow/pull/1285))
- Move editor actions into editor controller
  ([#1282](https://github.com/codevise/pageflow/pull/1282))

#### Scrolled Entry Type

##### Published Entry

- Import scrolled entry type React app
  ([#1264](https://github.com/codevise/pageflow/pull/1264))
- Use seed data in scrolled entries
  ([#1248](https://github.com/codevise/pageflow/pull/1248),
   [#1270](https://github.com/codevise/pageflow/pull/1270),
   [#1278](https://github.com/codevise/pageflow/pull/1278),
   [#1286](https://github.com/codevise/pageflow/pull/1286))
- Fix section index and references to adjacent chapters
  ([#1316](https://github.com/codevise/pageflow/pull/1316))
- Render uploaded images in scrolled entries
  ([#1299](https://github.com/codevise/pageflow/pull/1299),
   [#1303](https://github.com/codevise/pageflow/pull/1303))
- Use chapters from db in navigaition bar
  ([#1298](https://github.com/codevise/pageflow/pull/1298),
   [#1308](https://github.com/codevise/pageflow/pull/1308))

##### Editor

- Render demo in editor
  ([#1268](https://github.com/codevise/pageflow/pull/1268))
- Use data from Backbone collections in scrolled editor preview
  ([#1293](https://github.com/codevise/pageflow/pull/1293),
   [#1294](https://github.com/codevise/pageflow/pull/1294))

##### Internal

- Pass scrolled entry to watchCollections in tests
  ([#1317](https://github.com/codevise/pageflow/pull/1317))
- Setup Capybara for scrolled engine
  ([#1289](https://github.com/codevise/pageflow/pull/1289))
- Set PAGEFLOW_EDITOR global in scrolled editor
  ([#1287](https://github.com/codevise/pageflow/pull/1287))

#### Development Setup

- DB seed data for scrolled entries
  ([#1274](https://github.com/codevise/pageflow/pull/1274),
   [#1302](https://github.com/codevise/pageflow/pull/1302))
- Split Travis run into multiple jobs
  ([#1261](https://github.com/codevise/pageflow/pull/1261))
- Generate JSDoc and SassDoc in GitHub workflow
  ([#1307](https://github.com/codevise/pageflow/pull/1307))
- Add needed command to node package development docs
  ([#1290](https://github.com/codevise/pageflow/pull/1290))
- Improve Capybara Chrome setup
  ([#1291](https://github.com/codevise/pageflow/pull/1291))

### Version 15.1.0.beta2

2019-12-05

[Compare changes](https://github.com/codevise/pageflow/compare/v15.1.0.beta1...v15.1.0.beta2)

- Exclude entry type spec dummy directories from gem which were
  included by accident and multiplied the gem file size.

### Version 15.1.0.beta1

2019-12-05

[Compare changes](https://github.com/codevise/pageflow/compare/15-0-stable...v15.1.0.beta1)

#### Published Entries

- Add width/height to social share images to make Facebook display
  them faster.
  ([#1223](https://github.com/codevise/pageflow/pull/1223))
- Add translations for some text track languages
  ([#1237](https://github.com/codevise/pageflow/pull/1237))

#### Rails Engine

- Introduce file importer API
  ([#1250](https://github.com/codevise/pageflow/pull/1250))
- Add entry type concept
  ([#1249](https://github.com/codevise/pageflow/pull/1249))
- Add authentication provider
  ([#1236](https://github.com/codevise/pageflow/pull/1236))
- Bug fix: Index seed entry data files by perma id
  ([#1242](https://github.com/codevise/pageflow/pull/1242))
- Bug fix: Change revision#locale to always return string
  ([#1239](https://github.com/codevise/pageflow/pull/1239))

#### Internal

- Add entry type engines
  ([#1247](https://github.com/codevise/pageflow/pull/1247))
- Migrate legacy JavaScript to Rollup/Jest
  ([#1241](https://github.com/codevise/pageflow/pull/1241))
- Update pageflow-react build stack
  ([#1240](https://github.com/codevise/pageflow/pull/1240))
- Modernize editor JavaScript build stack
  ([#1238](https://github.com/codevise/pageflow/pull/1238))
- Replace chromedriver-helper by webdrivers
  ([#1251](https://github.com/codevise/pageflow/pull/1251))

See
[15-0-stable branch](https://github.com/codevise/pageflow/blob/15-0-stable/CHANGELOG.md)
for previous changes.
