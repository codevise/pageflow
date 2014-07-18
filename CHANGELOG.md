# CHANGELOG

### Changes on `master`

None so far.

### Version 0.2.0

##### Breaking Changes

- Themes have been splitted in Themes and Themings. Themings
  exist per account in the database containing configuration like
  copyright/imprint link urls and reference a theme. Themes represent
  available CSS and correspond directly to directories under
  `pageflow/themes`. Themes are registered in the Pageflow
  initializer.
  ([#45](https://github.com/codevise/pageflow/pull/45))

  To update your application:

  * Add the following line to your `config/initializers/pageflow.rb`:

          config.themes.register(:default)

  * Install and run the migrations to convert your database.

##### Public Site

- Bug fix: Improve video playback support on iOS and Android.
  ([#32](https://github.com/codevise/pageflow/pull/32), [#33](https://github.com/codevise/pageflow/pull/33))

##### Admin/Editor

- Theming attributes can now be edited via the accounts admin.
  ([#45](https://github.com/codevise/pageflow/pull/45))
- Option to require explicit confirmation of video/audio encoding by user
  before submitting jobs to Zencoder.
  ([#52](https://github.com/codevise/pageflow/pull/52))
- Preview draft revision via admin.
  ([#62](https://github.com/codevise/pageflow/pull/62))
- Bug fix: Missing translations for attribute/model names in admin.
  ([#36](https://github.com/codevise/pageflow/pull/36), [#58](https://github.com/codevise/pageflow/pull/66))
- Bug fix: Reusing files from other entries was broken in editor.
  ([#59](https://github.com/codevise/pageflow/pull/58))

##### Rails Engine

- Theme CSS files are automatically registered for asset precompilation.
  ([#45](https://github.com/codevise/pageflow/pull/45))
- `pageflow:theme` generator to copy theme template to main application.
  ([#45](https://github.com/codevise/pageflow/pull/45))
- More configurable default theme.
  ([#35](https://github.com/codevise/pageflow/pull/35))
- `public_entry_request_scope` option to restrict the published
  entries available under a certain host name.
  ([#61](https://github.com/codevise/pageflow/pull/61))

##### Internals

- Tests now use MySQL.
  The dummy application used to test the Pageflow Gem against now uses MySQL.
  To run the testsuite you need to have a MySQL database called `pageflow_dummy_test`
  You can configure user and password by setting the environment variables
  `PAGEFLOW_DB_USER` and `PAGEFLOW_DB_PASSWORD`. If they are not present `root` is
  assumed as user and the password is left blank.
  ([#56](https://github.com/codevise/pageflow/pull/56))
- The Accounts admin show template has been splitted into multiple
  partials.
  ([#65](https://github.com/codevise/pageflow/pull/65))
- Bug fix: Specify `jquery-ui-rails` major version in gemspec.
  ([#67](https://github.com/codevise/pageflow/pull/67))

### Version 0.1.0

- `pageflow:install` generator now creates resque rake tasks.
- Configuration option to change email address user invitations are sent from.
- Improved asset precompilation for production environment.

### Version 0.0.1

- Initial release
