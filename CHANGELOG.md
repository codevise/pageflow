# CHANGELOG

### Changes on `master`

- Tests now use MySQL.
  The dummy application used to test the Pageflow Gem against now uses MySQL.
  To run the testsuite you need to have a MySQL database called `pageflow_dummy_test`
  You can configure user and password by setting the environment variables
  `PAGEFLOW_DB_USER` and `PAGEFLOW_DB_PASSWORD`. If they are not present `root` is
  assumed as user and the password is left blank.

- **Breaking Change**: Themes have been splitted in Themes and Themings. Themings
  exist per account in the database containing configuration like
  copyright/imprint link urls and reference a theme. Themes represent
  available CSS and correspond directly to directories under
  `pageflow/themes`. Themes are registered in the Pageflow
  initializer. To update your application:

  * Add the following line to your `config/initializers/pageflow.rb`:

        config.themes.register(:default)

  * Install and run the migrations to convert your database.

- Theme CSS files are automatically registered for asset precompilation.
- Theming attributes can now be edited via the accounts admin.
- `pageflow:theme` generator to copy theme template to main application.

- More configurable default theme.
- Option to require explicit confirmation of video/audio encoding by user
  before submitting jobs to Zencoder.
- Preview draft revision via admin.

- Bug fix: Improve video playback support on iOS and Android.
- Bug fix: Missing translations for attribute/model names in admin.
- Bug fix: Reusing files from other entries was broken in editor.

### Version 0.1.0

- `pageflow:install` generator now creates resque rake tasks.
- Configuration option to change email address user invitations are sent from.
- Improved asset precompilation for production environment.

### Version 0.0.1

- Initial release
