# CHANGELOG

### Version 15.0.2

2019-11-28

[Compare changes](https://github.com/codevise/pageflow/compare/v15.0.1...v15.0.2)

- Change revision#locale to always return string
  ([#1243](https://github.com/codevise/pageflow/pull/1243))
- Add text track languages
  ([#1244](https://github.com/codevise/pageflow/pull/1244))
- Index seed entry data files by perma id
  ([#1245](https://github.com/codevise/pageflow/pull/1245))

### Version 15.0.1

2019-11-04

[Compare changes](https://github.com/codevise/pageflow/compare/v15.0.0...v15.0.1)

- Version 15.0.0 contained an out-of-date Webpack built.

### Version 15.0.0

2019-11-04

[Compare changes](https://github.com/codevise/pageflow/compare/14-x-stable...v15.0.0)

See
[changes grouped by pre releases](https://github.com/codevise/pageflow/blob/v15.0.0.rc2/CHANGELOG.md).

#### Breaking Changes

- Refactor file modules
  ([#1180](https://github.com/codevise/pageflow/pull/1180))

  This version includes various refactorings and class renamings.
  If you include any of the files or modules below, you need to update your code accordingly.

  ##### File modules:
  HostedFile => UploadableFile (concerning uploading of files)\
  UploadedFile => ReusableFile (concerning usage of files)

  ##### StateMachines:
  ProcessedFileStateMachine => ImageAndTextTrackProcessingStateMachine\
  EncodedFileStateMachine => MediaEncodingStateMachine

  ##### StateMachineJobs:
  ProcessFileJob => ProcessImageOrTextTrackJob

- Introduce PermaId on FileUsage, change file lookup to PermaId throughout Pageflow codebase.
  ([#1179](https://github.com/codevise/pageflow/pull/1179),
   [#1194](https://github.com/codevise/pageflow/pull/1194))

  File lookup is now done via the `perma_id` of the files usage within the revisions scope.
  Therefore it is strongly advised to change file lookup to the new RevisionFileHelper:

  I.e.
  ```
  Pageflow::Imagefile.find(some_id)
  ```
  has to become
  ```
  include RevisionFileHelper
  [...]
  find_file_in_entry(Pageflow::Imagefile, image_file_usage_perma_id)
  ```

  Also see migration inside the PR.

- Entry export/import
  ([#1219](https://github.com/codevise/pageflow/pull/1219),
   [#1234](https://github.com/codevise/pageflow/pull/1234))

  File types need to be updated to integrate correctly with the new
  entry export/import feature. Check the updated
  ["Creating File Types" guide](https://github.com/codevise/pageflow/blob/master/doc/creating_file_types.md)
  for details.

#### Manual Update Step

- Remove default charset utf8mb3. This is motivated by the popularity
  of emoji, which utf8mb3 doesn't support. Note that from Rails 6
  onwards, for MySQL utf8mb4 is also the default [1]. For existing
  Pageflow instances, especially when using MySQL 5.5 or 5.6, a switch
  to utf8mb4 might work better after setting `INNODB_LARGE_PREFIX` and
  making related changes towards allowing a longer index key prefix
  [2], which in those versions isn't yet the default. For new
  installations, MySQL 5.7 is preferable to older versions, because,
  from a Rails perspective, it has 4-byte-character-friendlier default
  settings. Also see MySQL's official guide on converting between
  3-byte and 4-byte character sets [3].
  ([#1210](https://github.com/codevise/pageflow/pull/1210))

  [1] https://github.com/rails/rails/pull/33608

  [2] https://dev.mysql.com/doc/refman/5.5/en/innodb-parameters.html#sysvar_innodb_large_prefix

  [3] https://dev.mysql.com/doc/refman/5.5/en/charset-unicode-conversion.html

#### Published Entries

- Update Twitter share URL
  ([#1202](https://github.com/codevise/pageflow/pull/1202))
- Info box pointer-events enabled for anchor tag
  ([#1214](https://github.com/codevise/pageflow/pull/1214))
- More options for title loading spinner
  ([#1215](https://github.com/codevise/pageflow/pull/1215))
- Theme options for logo and loading spinner
  ([#1216](https://github.com/codevise/pageflow/pull/1216))
- Add active class color styling for mobile share panel
  ([#1232](https://github.com/codevise/pageflow/pull/1232))

#### Editor

- Make tabs in mobile editor touchable
  ([#1212](https://github.com/codevise/pageflow/pull/1212))
- Prevent perma_id clashes for concurrently created revision components
  ([#1225](https://github.com/codevise/pageflow/pull/1225),
   [#1233](https://github.com/codevise/pageflow/pull/1233))
- Ensure caching of generated stylesheet is invaliated when files are
  added.
  ([#1224](https://github.com/codevise/pageflow/pull/1224))

#### Rails Engine

- Require Sprockets < 4
  ([#1217](https://github.com/codevise/pageflow/pull/1217),
   [#1220](https://github.com/codevise/pageflow/pull/1220))
- Drop `pageflow_accounts_themes` table
  ([#1205](https://github.com/codevise/pageflow/pull/1205))
- Allow specifying prerequisites in file type lint specs
  ([#1221](https://github.com/codevise/pageflow/pull/1221))
- Bug fix: fix entry membership create error
  ([#1196](https://github.com/codevise/pageflow/pull/1196))
- Bug fix: fix missing analytics interpolator variables
  ([#1192](https://github.com/codevise/pageflow/pull/1192))

#### Internal

- Add sassc-rails as development dependency
  ([#1222](https://github.com/codevise/pageflow/pull/1222))

See
[14-x-stable branch](https://github.com/codevise/pageflow/blob/14-x-stable/CHANGELOG.md)
for previous changes.
