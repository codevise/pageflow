# CHANGELOG

### Changes on `master`

##### Public Site

- Allow displaying a different poster image for video pages on mobile
  devices where autoplay is not supported.
  ([#143](https://github.com/codevise/pageflow/pull/143))
- Improve Facebook open graph meta tags.
  ([#157](https://github.com/codevise/pageflow/pull/157))

### 0.5.0

##### Manual Update Step

To enable the new built in audio loop page type, you need to add the
following line to your `config/initializers/pageflow.rb` file:

      config.register_page_type(Pageflow::BuiltInPageType.audio_loop)

##### Public Site

- Improve playback of certain videos in Firefox.
  ([#116](https://github.com/codevise/pageflow/pull/116))
- Add audio loop page type.
  ([#120](https://github.com/codevise/pageflow/pull/120))
- Allow page thumbnails to be explictly defined.
  ([#121](https://github.com/codevise/pageflow/pull/121))
- Reword multimedia alert.
  ([#122](https://github.com/codevise/pageflow/pull/122))
- Background shadow position always left on phones.
  ([#123](https://github.com/codevise/pageflow/pull/123))
- Do not display chapter headings in overview if only one chapter
  exists. Improve display of multiline chapter titles in overview.
  ([#130](https://github.com/codevise/pageflow/pull/130))
- Improve styling of player controls on mobile platforms.
  ([#132](https://github.com/codevise/pageflow/pull/132))
- Allow hiding social media links in themes by adding a CSS class.
  ([#135](https://github.com/codevise/pageflow/pull/135))
- Add `data-theme` attribute to DOM so page types can determine the
  current theme name.
  ([#136](https://github.com/codevise/pageflow/pull/136))
- Bug fix: Correct color of links in additional info box.
  ([#117](https://github.com/codevise/pageflow/pull/117))
- Bug fix: iOS 8 window.onload bug workaround.
  ([#119](https://github.com/codevise/pageflow/pull/119),
  [#131](https://github.com/codevise/pageflow/pull/131))
- Bug fix: Add missing overview pictogram for internal links page.
  ([#137](https://github.com/codevise/pageflow/pull/137))

##### Admin/Editor

- Display an error message if an uploaded file cannot be matched to a
  file type.
  ([#133](https://github.com/codevise/pageflow/pull/133))
- Bug fix: Spelling error in form input label.
  ([#128](https://github.com/codevise/pageflow/pull/128))
- Bug fix: Do not escape HTML in preview of thumbnail hover texts in
  internal links page.
  ([#134](https://github.com/codevise/pageflow/pull/134))

##### Rails Engine

- Allow page types to introduce new file types.
  ([#124](https://github.com/codevise/pageflow/pull/124))
- Allow page types to customize their thumbnail representation.
  ([#138](https://github.com/codevise/pageflow/pull/138))
- Remove some unused images from default theme.
  ([#139](https://github.com/codevise/pageflow/pull/139))
- Make zencoder urls configurable.
  ([#145](https://github.com/codevise/pageflow/pull/145))

### Version 0.4.0

##### Breaking Changes

- The `<meta name="description" />` tag now uses the `Entry#summary`
  attribute which can be edited in the editor. If you have a custom
  `layouts/pageflow/_meta_tags.html.erb` partial in your project,
  remove the description meta tag there to prevent duplicate tags.
  ([#112](https://github.com/codevise/pageflow/pull/112))

##### Public Site

- Improve generation of credits box.
  ([#99](https://github.com/codevise/pageflow/pull/99))
- Bug fix: Respond with 404 for unknown format.
  ([#101](https://github.com/codevise/pageflow/pull/101))
- Bug fix: Decrease margin of links in text in default theme.
  ([#108](https://github.com/codevise/pageflow/pull/108))
- Bug fix: Ensure top margin in additional info box even if no title
  is present.
  ([#109](https://github.com/codevise/pageflow/pull/109))
- Bug fix: Logo was no longer left aligned at certain window widths.
  ([#111](https://github.com/codevise/pageflow/pull/111))

##### Admin/Editor

- Improve order of files in editor.
  ([#105](https://github.com/codevise/pageflow/pull/105))
- Improve order of items in select boxes of membership form.
  ([#107](https://github.com/codevise/pageflow/pull/107))
- Blank slate for editor.
  ([#110](https://github.com/codevise/pageflow/pull/110))
- Improve encoding confirmation workflow in editor.
  ([#113](https://github.com/codevise/pageflow/pull/113))
- Improve entry publication workflow in editor.
  ([#114](https://github.com/codevise/pageflow/pull/114))
- Bug fix: Editing a newly created page altered the default attribute
  values of subsequently created pages.
  ([#103](https://github.com/codevise/pageflow/pull/103))
- Bug fix: Update positions of chapters and pages when an item is
  removed.
  ([#104](https://github.com/codevise/pageflow/pull/104))
- Bug fix: Do not send bad request by trying to save order of empty
  chapter.
  ([#104](https://github.com/codevise/pageflow/pull/104))
- Bug fix: Link dialog of rich text editor was broken.
  ([#108](https://github.com/codevise/pageflow/pull/108))

### Version 0.3.0

##### Breaking Changes

- Requiring `pageflow/seeds` in your `db/seeds.rb` file no longer
  automatically creates database records. Instead, you can include the
  `Pageflow::Seeds` module to configure your database seed via a DSL.
  ([#73](https://github.com/codevise/pageflow/pull/73))

  To keep seeding your database with the same default users and sample
  entry as before, re-running the `pagflow:seeds` generator and choose
  to overwrite your your `db/seeds.rb` file:

      $ cd your_pageflow_app/
      $ rails generate pageflow:seeds

- DOM change: `.navigation a.navigation_home` has been renamed to
  `.navigation a.navigation_top`. You need to update corresponding
  selectors inside custom themes. Instead, a new `.navigation
  a.navigation_home` button is now supported, which links to a
  configurable external site.
  ([#98](https://github.com/codevise/pageflow/pull/98))

  If you do not wish to use this new home button with your custom
  theme, you can disable it when registering themes in your
  `config/initializers/pageflow.rb`:

      config.themes.register(:custom, no_home_button: true)

  This will cause Pageflow to only render the `a.navigation_top` link
  in entries using your theme.

##### Public Site

- Bug fix: Audio player timestamps were flickering on play.
  ([#74](https://github.com/codevise/pageflow/pull/74))
- Bug fix: Link IE stylesheets/javascripts correctly.
  ([#81](https://github.com/codevise/pageflow/pull/81), [#92](https://github.com/codevise/pageflow/pull/92))
- Bug fix: Improve SSL support
  ([#88](https://github.com/codevise/pageflow/pull/88))
- Bug fix: Ensure entry stylesheets are not cached after
  re-publication.
  ([#94](https://github.com/codevise/pageflow/pull/94))

##### Admin/Editor

- Audio/video autoplay is now configurable.
  ([#95](https://github.com/codevise/pageflow/pull/95))
- Bug fix: Rich text editor added `<p>` instead of `<br>` tags in IE 11.
  ([#91](https://github.com/codevise/pageflow/pull/91))

##### Rails Engine

- Paths of files generated by Zencoder are now configurable.
  ([#71](https://github.com/codevise/pageflow/pull/71))
- Zencoder output to Akamai NetStorage.
  ([#78](https://github.com/codevise/pageflow/pull/78))
- Generate protocol relative Zencoder urls when `:s3_protocol` in
  `zencoder_options` is empty string.
  ([#83](https://github.com/codevise/pageflow/pull/83))
- `public_entry_url_options` option to configure urls of published entries.
  ([#84](https://github.com/codevise/pageflow/pull/84), [#97](https://github.com/codevise/pageflow/pull/97))
- Placeholder partial to integrate analytics in editor.
  ([#93](https://github.com/codevise/pageflow/pull/93))
- Editor JavaScript API to allow new page types to provide new editor features.
  ([#96](https://github.com/codevise/pageflow/pull/96))
- Bug fix: Update jbuilder gem dependency
  ([#79](https://github.com/codevise/pageflow/pull/79))

### Version 0.2.1

- Update Zencoder gem to fix [Zencoder SSL issue](http://status.zencoder.com/events/84) ([#70](https://github.com/codevise/pageflow/pull/70)).

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
