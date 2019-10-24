# CHANGELOG

### Version 15.0.0.beta3

2019-10-24

[Compare changes](https://github.com/codevise/pageflow/compare/14-x-stable...v15.0.0.beta3)

#### Breaking Changes

- Entry export/import
  ([#1219](https://github.com/codevise/pageflow/pull/1219))

  File types need to be updated to integrate correctly with the new
  entry export/import feature. Check the updated
  ["Creating File Types" guide](https://github.com/codevise/pageflow/blob/master/doc/creating_file_types.md)
  for details.

#### Published Entries

- Info box pointer-events enabled for anchor tag
  ([#1214](https://github.com/codevise/pageflow/pull/1214))
- More options for title loading spinner
  ([#1215](https://github.com/codevise/pageflow/pull/1215))
- Theme options for logo and loading spinner
  ([#1216](https://github.com/codevise/pageflow/pull/1216))

#### Editor

- Make tabs in mobile editor touchable
  ([#1212](https://github.com/codevise/pageflow/pull/1212))

#### Rails Engine

- Require Sprockets < 4
  ([#1217](https://github.com/codevise/pageflow/pull/1217))
- Drop pageflow_accounts_themes table
  ([#1205](https://github.com/codevise/pageflow/pull/1205))
- Bug fix: fix entry membership create error
  ([#1196](https://github.com/codevise/pageflow/pull/1196))
- Bug fix: fix missing analytics interpolator variables
  ([#1192](https://github.com/codevise/pageflow/pull/1192))

### Version 15.0.0.beta2

2019-08-01

[Compare changes](https://github.com/codevise/pageflow/compare/v15.0.0.beta1...v15.0.0.beta2)

- Move UsedFileTestHelper to support directory
  in order to make it available in Plugins.
  Require it in spec_helper to keep it available in Pageflow itself.
  ([#1194](https://github.com/codevise/pageflow/pull/1194))

- Remove default charset utf8mb3. This is motivated by the popularity
  of emoji, which utf8mb3 doesn't support. Note that from Rails 6
  onwards, for MySQL utf8mb4 is also the default [1]. For existing
  Pageflow instances, especially when using MySQL 5.5 or 5.6, a switch
  to utf8mb4 might work better after setting INNODB_LARGE_PREFIX and
  making related changes towards allowing a longer index key prefix
  [2], which in those versions isn't yet the default. For new
  installations, MySQL 5.7 is preferable to older versions, because,
  from a Rails perspective, it has 4-byte-character-friendlier default
  settings. Also see MySQL's official guide on converting between
  3-byte and 4-byte character sets [3].
  ([#1210](https://github.com/codevise/pageflow/pull/1194))

  [1] https://github.com/rails/rails/pull/33608

  [2] https://dev.mysql.com/doc/refman/5.5/en/innodb-parameters.html#sysvar_innodb_large_prefix

  [3] https://dev.mysql.com/doc/refman/5.5/en/charset-unicode-conversion.html

### Version 15.0.0.beta1

2019-07-31

[Compare changes](https://github.com/codevise/pageflow/compare/14-x-stable...v15.0.0.beta1)

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
  ([#1179](https://github.com/codevise/pageflow/pull/1179))

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

See
[14-x-stable branch](https://github.com/codevise/pageflow/blob/14-x-stable/CHANGELOG.md)
for previous changes.
