# CHANGELOG

### Changes on `master`

- **Breaking Change**: Themes have been splitted in Themes and Themings. Themings
  exist per account containing configuration like copyright/imprint
  link urls and reference a theme. Themes now exclusively represent
  the available CSS themes and correspond directly to directories
  under `pageflow/themes`. Run the migrations to convert your
  database.

- Bug fix: Improve video playback support on iOS and Android.
- Bug fix: Missing translations for attribute/model names in admin.

### Version 0.1.0

- `pageflow:install` generator now creates resque rake tasks.
- Configuration option to change email address user invitations are sent from.
- Improved asset precompilation for production environment.

### Version 0.0.1

- Initial release
