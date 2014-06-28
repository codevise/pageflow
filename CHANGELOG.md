# CHANGELOG

### Changes on `master`

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
- `pageflow:theme` generator to copy theme template to main application.

- Bug fix: Improve video playback support on iOS and Android.
- Bug fix: Missing translations for attribute/model names in admin.

### Version 0.1.0

- `pageflow:install` generator now creates resque rake tasks.
- Configuration option to change email address user invitations are sent from.
- Improved asset precompilation for production environment.

### Version 0.0.1

- Initial release
