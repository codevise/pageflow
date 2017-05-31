# CHANGELOG

### Version 12.0.0.rc5

2017-05-31

[Compare changes](https://github.com/codevise/pageflow/compare/v12.0.0.rc4...v12.0.0.rc5)

#### Breaking Changes

- The built-in widget types must now be registered in the host
  application.
  ([#774](https://github.com/codevise/pageflow/pull/774),
   [#776](https://github.com/codevise/pageflow/pull/776))

  To keep existing functionality from previous Pageflow versions, add
  this line to the Pageflow initializer in your host application:

        config.plugin(Pageflow.built_in_widget_types_plugin)

- The built-in widget types must now be registered in the host
  application.

  To keep existing functionality from previous Pageflow versions, add
  these lines to `config/initializers/pageflow.rb` in your host
  application:

        # Register the built-in widget types.
        # You can remove these or add different versions with the same name.
        config.widget_types.register(Pageflow::BuiltInWidgetType.navigation, default: true)
        config.widget_types.register(Pageflow::BuiltInWidgetType.mobile_navigation, default: true)
        config.widget_types.register(Pageflow::BuiltInWidgetType.classic_player_controls, default: true)
        config.widget_types.register(Pageflow::BuiltInWidgetType.slim_player_controls)

##### Bug Fixes

- Upgrade to Sinon 2
  ([#777](https://github.com/codevise/pageflow/pull/777))
- Bug fix: Mark %pageflow_widget_margin_right optional
  ([#773](https://github.com/codevise/pageflow/pull/773))

### Version 12.0.0.rc4

2017-05-23

[Compare changes](https://github.com/codevise/pageflow/compare/v12.0.0.rc3...v12.0.0.rc4)

##### Breaking Changes

- Remove legacy theme files. All themes have to be based on the
  default theme.
  ([#768](https://github.com/codevise/pageflow/pull/768))

##### Bug Fixes

- Bug fix: Fix exception when sorting user accounts table by role
  ([#769](https://github.com/codevise/pageflow/pull/769))
- Bug fix: Change roles.high to not expect account membership
  ([#766](https://github.com/codevise/pageflow/pull/766))

### Version 12.0.0.rc3

2017-05-12

[Compare changes](https://github.com/codevise/pageflow/compare/v12.0.0.rc2...v12.0.0.rc3)

##### Manual Update Step

- Switch from `Expires` to `Cache-Control` header for media uploads.
  ([#753](https://github.com/codevise/pageflow/pull/753))

  It’s recommended you update the files currently stored on S3:

        $ s3cmd --recursive modify --add-header="Cache-Control: public, max-age=31536000" s3://yourbucket/
        $ s3cmd --recursive modify --remove-header=Expires s3://yourbucket/

  Tread carefully when you do this! As noted in
  [this StackExchange answer](http://stackoverflow.com/questions/22501465/how-to-add-cache-control-in-aws-s3),
  we have experienced that some public read permissions were lost
  after running this script. Test first using just a single object. In
  the AWS Management Console, you might want to grant public read
  access on the entire bucket again to be safe.

##### Minor Changes

- Ensure public translations fall back to default locale
  ([#757](https://github.com/codevise/pageflow/pull/757))
- Depend on pageflow-public-i18n 1.9
  ([#752](https://github.com/codevise/pageflow/pull/752))
- Remove jQuery widgets formerly used by player controls
  ([#756](https://github.com/codevise/pageflow/pull/756))
- Bug fix: Use entry locale in CloseButton translations
  ([#760](https://github.com/codevise/pageflow/pull/760))
- Bug fix: Fix ensureValueDefined option of SelectInputView
  ([#755](https://github.com/codevise/pageflow/pull/755))

### Version 12.0.0.rc2

2017-05-10

[Compare changes](https://github.com/codevise/pageflow/compare/v12.0.0.rc1...v12.0.0.rc2)

- Improve text track positioning for slim player controls
  ([#749](https://github.com/codevise/pageflow/pull/749))
- Bug fix: Fix HTML descriptions in infobox component
  ([#751](https://github.com/codevise/pageflow/pull/751))
- Use correct matcher to expect destroyed record
  ([#750](https://github.com/codevise/pageflow/pull/750))

### Version 12.0.0.rc1

2017-04-25

[Compare changes](https://github.com/codevise/pageflow/compare/0-11-stable...v12.0.0.rc1)

##### Breaking Changes

- The `pageflow-react` gem has been merged into the core `pageflow`
  gem. Remove the `pageflow-react` entry from your `Gemfile` if one
  exists and make sure you update all gems that depend on
  `pageflow-react` to versions that only depend on `pageflow` instead.
  ([#721](https://github.com/codevise/pageflow/pull/721),
   [#744](https://github.com/codevise/pageflow/pull/744))

  In the Pageflow initializer, delete all lines that register page
  types from `Pageflow::BuiltInPageType`, i.e. lines of the form:

        config.page_types.register(Pageflow::BuiltInPageType.background_image)

  Insert the following single line instead:

        config.plugin(Pageflow.built_in_page_types_plugin)

  Finally, in `app/assets/javascript/components.js` replace

        //= require pageflow/react/components

  with

        //= require pageflow/components

- The background audio page type has been replaced by the atmo
  feature. There is a migration turning all background audio pages
  into background image pages with a atmo audio. The atmo settings are
  no longer guarded by a feature flag. If you used
  `Pageflow::Features#enabled_by_default` to enable the feature for
  all accounts, you need to remove that call from your
  initializer.
  ([#748](https://github.com/codevise/pageflow/pull/748))

- All page types that used to support only background images can now
  display a background video as well. The background video page type
  accordingly has been removed. There is a migration to turn
  background video pages into pages with video background type.
  ([#748](https://github.com/codevise/pageflow/pull/748))

##### Public Site

- Embed entries as iframes
  ([#665](https://github.com/codevise/pageflow/pull/665))
- Use slim controls as android phone player
  ([#745](https://github.com/codevise/pageflow/pull/745))

Media stack:

- FullHD/4k video variants
  ([#653](https://github.com/codevise/pageflow/pull/653),
   [#741](https://github.com/codevise/pageflow/pull/741))
- Update Video.js and add Dash support
  ([#678](https://github.com/codevise/pageflow/pull/678),
   [#677](https://github.com/codevise/pageflow/pull/677),
   [#746](https://github.com/codevise/pageflow/pull/746))
- Allow displaying text tracks on videos and audio pages
  ([#721](https://github.com/codevise/pageflow/pull/721),
   [#747](https://github.com/codevise/pageflow/pull/747),
   [#743](https://github.com/codevise/pageflow/pull/743))
- Add feature detection for mobile video features
  ([#742](https://github.com/codevise/pageflow/pull/742))
- Add ultra variant to image file and video file posters
  ([#706](https://github.com/codevise/pageflow/pull/706))
- Bug fix: Fix video loop on safari 10 on el capitan.
  ([#663](https://github.com/codevise/pageflow/pull/663))
- Bug fix: Prevent prebuffer/volume fading from failing on dispose
  ([#719](https://github.com/codevise/pageflow/pull/719))
- Do not filter sources for audio tags
  ([#709](https://github.com/codevise/pageflow/pull/709))
- Bug fix: Continue prebuffer on media tag init
  ([#740](https://github.com/codevise/pageflow/pull/740))

Theme:

- Add theme option to hide glow behind loading spinner logo
  ([#675](https://github.com/codevise/pageflow/pull/675))
- Add logo theme option to fade in with header
  ([#666](https://github.com/codevise/pageflow/pull/666))
- Logo theme options
  ([#733](https://github.com/codevise/pageflow/pull/733))
- Update to more complete variant of source sans pro font
  ([#676](https://github.com/codevise/pageflow/pull/676))
- Allow setting hide text related css classes on wrapper
  ([#651](https://github.com/codevise/pageflow/pull/651))
- Use svg icon for slim loading spinner
  ([#718](https://github.com/codevise/pageflow/pull/718))
- Allow overriding typography of slim control bar text
  ([#726](https://github.com/codevise/pageflow/pull/726))
- Style text track cues
  ([#713](https://github.com/codevise/pageflow/pull/713))
- Theme for player controls menu bar
  ([#717](https://github.com/codevise/pageflow/pull/717))
- Hide audio page content when text tracks are displayed
  ([#698](https://github.com/codevise/pageflow/pull/698))
- Add css class to page background with controls
  ([#722](https://github.com/codevise/pageflow/pull/722))
- Bug fix: Fix css class collision in widget scroll indicators
  ([#667](https://github.com/codevise/pageflow/pull/667))
- Bug fix: Allow overriding widget theme options
  ([#723](https://github.com/codevise/pageflow/pull/723))

JavaScript API:

- Allow to programatically re-enable atmo on mobile devices
  ([#670](https://github.com/codevise/pageflow/pull/670))
- Trigger event when widgets are updated
  ([#712](https://github.com/codevise/pageflow/pull/712))
- Trigger event when slideshow is resized
  ([#707](https://github.com/codevise/pageflow/pull/707))
- Only fire hidetext events on state changes
  ([#701](https://github.com/codevise/pageflow/pull/701))
- Trigger event when seed data is available
  ([#687](https://github.com/codevise/pageflow/pull/687))
- Ensure page is unprepared if it was not activated
  ([#650](https://github.com/codevise/pageflow/pull/650))

Seed data:

- Reorganize file seed data
  ([#686](https://github.com/codevise/pageflow/pull/686))
- Add video file url to templates and json
  ([#714](https://github.com/codevise/pageflow/pull/714))
- Add is_ready flag to file json representation
  ([#704](https://github.com/codevise/pageflow/pull/704))
- Include entry slug in common seed
  ([#702](https://github.com/codevise/pageflow/pull/702))
- Render storylines as array in seed data
  ([#680](https://github.com/codevise/pageflow/pull/680))
- Bug fix: Set position for seeded chapters
  ([#643](https://github.com/codevise/pageflow/pull/643))

Widgets:

- Player controls improvements
  ([#699](https://github.com/codevise/pageflow/pull/699),
   [#720](https://github.com/codevise/pageflow/pull/720),
   [#739](https://github.com/codevise/pageflow/pull/739))
- Prevent videojs controls from being displayed
  ([#697](https://github.com/codevise/pageflow/pull/697))
- Bug fix: Prevent line wrap in scroll indicator
  ([#729](https://github.com/codevise/pageflow/pull/729))
- Bug fix: Fix sharing menu in mobile navigation
  ([#661](https://github.com/codevise/pageflow/pull/661))
- Bug fix: Fix page widget index for analytics adapters
  ([#652](https://github.com/codevise/pageflow/pull/652))
- Bug fix: Extend Facebook in-app browser fix to iOS platform
  ([#637](https://github.com/codevise/pageflow/pull/637))

##### Admin

- Role based account memberships
  ([#634](https://github.com/codevise/pageflow/pull/634),
   [#641](https://github.com/codevise/pageflow/pull/641),
   [#640](https://github.com/codevise/pageflow/pull/640))

##### Editor

- File configuration
  ([#654](https://github.com/codevise/pageflow/pull/654),
   [#703](https://github.com/codevise/pageflow/pull/703),
   [#673](https://github.com/codevise/pageflow/pull/673))
- Add alt text attribute to files
  ([#685](https://github.com/codevise/pageflow/pull/685))
- Manage text track files as nested files
  ([#660](https://github.com/codevise/pageflow/pull/660),
   [#684](https://github.com/codevise/pageflow/pull/684),
   [#683](https://github.com/codevise/pageflow/pull/683),
   [#682](https://github.com/codevise/pageflow/pull/682),
   [#688](https://github.com/codevise/pageflow/pull/688),
   [#716](https://github.com/codevise/pageflow/pull/716))
- File filters
  ([#659](https://github.com/codevise/pageflow/pull/659))
- Let file selection handler abort navigation
  ([#736](https://github.com/codevise/pageflow/pull/736))
- Add background inputs group
  ([#711](https://github.com/codevise/pageflow/pull/711))
- Improve editor page lifecycle during delete
  ([#710](https://github.com/codevise/pageflow/pull/710))
- Make editor play nicely with Redux
  ([#700](https://github.com/codevise/pageflow/pull/700))
- Improve html translation support in i18nUtils
  ([#671](https://github.com/codevise/pageflow/pull/671))
- Add interpolation support for i18nUtils.findTranslation
  ([#648](https://github.com/codevise/pageflow/pull/648))
- Bug fix: Use correct Backbone sync parameter to trigger retry
  ([#696](https://github.com/codevise/pageflow/pull/696))
- Bug fix: Do not overwrite file rights when polling
  ([#715](https://github.com/codevise/pageflow/pull/715))
- Bug fix: Improve special character handling in formDataUtils
  ([#690](https://github.com/codevise/pageflow/pull/690))

Backbone Views:

- Improve DropDownButton
  ([#681](https://github.com/codevise/pageflow/pull/681))
- Ensure select input view displays default
  ([#725](https://github.com/codevise/pageflow/pull/725))
- Add disabled option to referenceinputview
  ([#734](https://github.com/codevise/pageflow/pull/734))

Help:

- Allow external links in editor help
  ([#649](https://github.com/codevise/pageflow/pull/649))
- Add inline help for background inputs
  ([#728](https://github.com/codevise/pageflow/pull/728))
- Add help entry for text tracks
  ([#727](https://github.com/codevise/pageflow/pull/727))
- Improve inline help for rights and alt text field
  ([#724](https://github.com/codevise/pageflow/pull/724))

##### Rails Engine

- Introduce conditional thumbnail candidates
  ([#705](https://github.com/codevise/pageflow/pull/705))
- Add option to skip smil output
  ([#645](https://github.com/codevise/pageflow/pull/645))
- Improve hls options fallback
  ([#708](https://github.com/codevise/pageflow/pull/708))
- Link to plugins wiki page from readme
  ([#674](https://github.com/codevise/pageflow/pull/674))

##### Internals

- Use doclets.io for javascript api reference
  ([#644](https://github.com/codevise/pageflow/pull/644))
- Git ignore coverage directory
  ([#647](https://github.com/codevise/pageflow/pull/647))
- Use only one jshint config for hound
  ([#658](https://github.com/codevise/pageflow/pull/658))
- Do not warn about missing frozen string comment
  ([#646](https://github.com/codevise/pageflow/pull/646))
- Update travis ruby version to 2.1.7
  ([#695](https://github.com/codevise/pageflow/pull/695))
- Remove cargo-culted @body_class
  ([#616](https://github.com/codevise/pageflow/pull/616))
- Remove unneeded loop
  ([#578](https://github.com/codevise/pageflow/pull/578))
- Use create instead of build_stubbed in EditLock tests
  ([#689](https://github.com/codevise/pageflow/pull/689))
- Bug fix: Handle symbolized keys in mailer options
  ([#693](https://github.com/codevise/pageflow/pull/693))

See
[0-11-stable](https://github.com/codevise/pageflow/blob/0-11-stable/CHANGELOG.md)
branch for previous changes.
