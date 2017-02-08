# CHANGELOG

### Changes on `master`

[Compare changes](https://github.com/codevise/pageflow/compare/v0.11.0...master)

##### Public Site

Media stack:

- FullHD/4k video variants
  ([#653](https://github.com/codevise/pageflow/pull/653))
- Update Video.js and add Dash support
  ([#678](https://github.com/codevise/pageflow/pull/678),
   [#677](https://github.com/codevise/pageflow/pull/677))
- Embed entries as iframes
  ([#665](https://github.com/codevise/pageflow/pull/665))
- Add ultra variant to image file and video file posters
  ([#706](https://github.com/codevise/pageflow/pull/706))
- Bug fix: Fix video loop on safari 10 on el capitan.
  ([#663](https://github.com/codevise/pageflow/pull/663))
- Bug fix: Prevent prebuffer/volume fading from failing on dispose
  ([#719](https://github.com/codevise/pageflow/pull/719))
- Do not filter sources for audio tags
  ([#709](https://github.com/codevise/pageflow/pull/709))
  
Theme:

- Add theme option to hide glow behind loading spinner logo
  ([#675](https://github.com/codevise/pageflow/pull/675))
- Add logo theme option to fade in with header
  ([#666](https://github.com/codevise/pageflow/pull/666))
- Update to more complete variant of source sans pro font
  ([#676](https://github.com/codevise/pageflow/pull/676))
- Allow setting hide text related css classes on wrapper
  ([#651](https://github.com/codevise/pageflow/pull/651))
- Use svg icon for slim loading spinner
  ([#718](https://github.com/codevise/pageflow/pull/718))
- Style text track cues
  ([#713](https://github.com/codevise/pageflow/pull/713))
- Theme for player controls menu bar
  ([#717](https://github.com/codevise/pageflow/pull/717))
- Hide audio page content when text tracks are displayed
  ([#698](https://github.com/codevise/pageflow/pull/698))
- Bug fix: Fix css class collision in widget scroll indicators
  ([#667](https://github.com/codevise/pageflow/pull/667))

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
  ([#699](https://github.com/codevise/pageflow/pull/699))
- Prevent videojs controls from being displayed
  ([#697](https://github.com/codevise/pageflow/pull/697))
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
- Add background inputs group
  ([#711](https://github.com/codevise/pageflow/pull/711))
- Allow external links in editor help
  ([#649](https://github.com/codevise/pageflow/pull/649))
- Improve editor page lifecycle during delete
  ([#710](https://github.com/codevise/pageflow/pull/710))
- Make editor play nicely with Redux
  ([#700](https://github.com/codevise/pageflow/pull/700))
- Improve DropDownButton
  ([#681](https://github.com/codevise/pageflow/pull/681))
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

### Version 0.11.0

2016-09-09

[Compare changes](https://github.com/codevise/pageflow/compare/v0.10.0...v0.11.0)

##### Breaking Changes

- Pageflow now depends on Rails 4.2, which is the only version below
  Rails 5 that still receives security and bug fixes. See the
  [Upgrading Rails guide](http://guides.rubyonrails.org/upgrading_ruby_on_rails.html)
  for changes you need to apply to your application.
  ([#575](https://github.com/codevise/pageflow/pull/575))

- Active Admin/Devise have been updated. The `gem` entries for
  `activeadmin`, `ransack`, `inherited_resources` and `formtastic`
  have to be removed. Furthermore, delete the following line from the
  Pageflow initializer:

        ActiveAdmin.application.load_paths.unshift(Dir[Pageflow::Engine.root.join('admins')])

  Instead insert the following line at the top of the Active Admin
  initializer:

        ActiveAdmin.application.load_paths.unshift(Pageflow.active_admin_load_path)

  See the
  [Active Admin changelog](https://github.com/activeadmin/activeadmin/blob/master/CHANGELOG.md)
  for instructions on how to upgrade the Active Admin initializer.
  ([#500](https://github.com/codevise/pageflow/pull/500))

- Error pages now live in the `public` directory of the host
  application. Run the following generator to copy the default error
  pages to `public/pageflow/error_pages`:

        $ bin/rails generate pageflow:error_pages

  Feel free to change the generated files however you like.
  ([#572](https://github.com/codevise/pageflow/pull/572))

- The default theme has partly been rewritten. See
  [the new theme guide](https://github.com/codevise/pageflow/blob/master/doc/creating_themes.md)
  for instructions on how to build themes that are decoupled from
  Pageflow implementation details.
  ([#470](https://github.com/codevise/pageflow/pull/470),
   [#576](https://github.com/codevise/pageflow/pull/576),
   [#586](https://github.com/codevise/pageflow/pull/586),
   [#590](https://github.com/codevise/pageflow/pull/590),
   [#591](https://github.com/codevise/pageflow/pull/591),
   [#592](https://github.com/codevise/pageflow/pull/592),
   [#593](https://github.com/codevise/pageflow/pull/593),
   [#594](https://github.com/codevise/pageflow/pull/594),
   [#596](https://github.com/codevise/pageflow/pull/596),
   [#597](https://github.com/codevise/pageflow/pull/597),
   [#598](https://github.com/codevise/pageflow/pull/598),
   [#626](https://github.com/codevise/pageflow/pull/626),
   [#618](https://github.com/codevise/pageflow/pull/618),
   [#600](https://github.com/codevise/pageflow/pull/600))

##### Public Site

- Rebrush default theme
  ([#612](https://github.com/codevise/pageflow/pull/612),
   [#611](https://github.com/codevise/pageflow/pull/611),
   [#588](https://github.com/codevise/pageflow/pull/588))
- Minimalistic player controls
  ([#558](https://github.com/codevise/pageflow/pull/558))
- Move share button in mobile navigation to bottom
  ([#551](https://github.com/codevise/pageflow/pull/551))
- Scroll to active item in overview item
  ([#555](https://github.com/codevise/pageflow/pull/555))
- Improve hide text css
  ([#541](https://github.com/codevise/pageflow/pull/541))
- Improve focus outline handling
  ([#543](https://github.com/codevise/pageflow/pull/543))
- Increase fastclick compatibility of share menu
  ([#548](https://github.com/codevise/pageflow/pull/548))
- Disable atmo on mobile platform
  ([#554](https://github.com/codevise/pageflow/pull/554))
- Ensure facebook app does not crop viewport
  ([#607](https://github.com/codevise/pageflow/pull/607))
- Apply widget margin to mobile scroll indicator
  ([#606](https://github.com/codevise/pageflow/pull/606))
- Bug fix: Fix keyboard access to sub share menu
  ([#553](https://github.com/codevise/pageflow/pull/553))
- Bug fix: Do not set video src on video page activate
  ([#547](https://github.com/codevise/pageflow/pull/547))
- Bug fix: Prevent native scrolling on multimedia alert
  ([#550](https://github.com/codevise/pageflow/pull/550))
- Bug fix: Ensure entry cache is invalidated when theming changes
  ([#627](https://github.com/codevise/pageflow/pull/627))

##### Admin

- Improve filtering, sorting and pagination of admin tables
  ([#568](https://github.com/codevise/pageflow/pull/568),
   [#567](https://github.com/codevise/pageflow/pull/567),
   [#563](https://github.com/codevise/pageflow/pull/563))
- Allow setting defaults for meta tags per theming
  ([#538](https://github.com/codevise/pageflow/pull/538),
   [#573](https://github.com/codevise/pageflow/pull/573))
- Improve revisions table on entry admin page
  ([#619](https://github.com/codevise/pageflow/pull/619))

##### Editor

- Allow specifying custom share url
  ([#581](https://github.com/codevise/pageflow/pull/581))
- Add option to hide overview button
  ([#556](https://github.com/codevise/pageflow/pull/556))
- Display warning for ie 9 in editor
  ([#552](https://github.com/codevise/pageflow/pull/552))
- Bug fix: Prevent scrolling preview while focus in sidebar
  ([#549](https://github.com/codevise/pageflow/pull/549))

##### Rails Engine

- Update activeadmin to 1.0.pre4
  ([#617](https://github.com/codevise/pageflow/pull/617),
   [#610](https://github.com/codevise/pageflow/pull/610))
- Update sass to 3.4
  ([#540](https://github.com/codevise/pageflow/pull/540))
- Switch to cancancan from cancan
  ([#615](https://github.com/codevise/pageflow/pull/615))
- Add config option to forbid deleting user account
  ([#535](https://github.com/codevise/pageflow/pull/535))
- Encapsulate active admin load path setup
  ([#570](https://github.com/codevise/pageflow/pull/570))
- Add off event emitter method to pageflow.hidetext.
  ([#542](https://github.com/codevise/pageflow/pull/542))
- Introduce widgets api
  ([#544](https://github.com/codevise/pageflow/pull/544))
- Introduce widget margins
  ([#557](https://github.com/codevise/pageflow/pull/557))
- Add page css classes for scroller boundary position
  ([#545](https://github.com/codevise/pageflow/pull/545))
- Allow overriding logic to determine highlightes page
  ([#605](https://github.com/codevise/pageflow/pull/605))
- Theme generator for configurable default theme
  ([#560](https://github.com/codevise/pageflow/pull/560))
- Prevent account with entries being deleted
  ([#599](https://github.com/codevise/pageflow/pull/599))
- Correct the documentation for js widget types
  ([#571](https://github.com/codevise/pageflow/pull/571))
- Update ruby version requirement in readme
  ([#620](https://github.com/codevise/pageflow/pull/620))
- Make sliderinputview more configurable
  ([#602](https://github.com/codevise/pageflow/pull/602))
- Add classnames to title bar action-items
  ([#608](https://github.com/codevise/pageflow/pull/608))
- Add browser agent based detection for ie up to 11
  ([#601](https://github.com/codevise/pageflow/pull/601))

##### Internals

- Upgrade to rspec 3
  ([#569](https://github.com/codevise/pageflow/pull/569))
- Add ruby 2.3.1 to travis file
  ([#609](https://github.com/codevise/pageflow/pull/609))
- Use parallel coverall builds
  ([#614](https://github.com/codevise/pageflow/pull/614))
- Generator unit tests
  ([#574](https://github.com/codevise/pageflow/pull/574))
- Generate theme documentation
  ([#559](https://github.com/codevise/pageflow/pull/559))
- Install coveralls test coverage reporter
  ([#561](https://github.com/codevise/pageflow/pull/561))
- Import new rubocop default from hound repository
  ([#580](https://github.com/codevise/pageflow/pull/580))
- Add scss_lint and rubocop to development dependency
  ([#625](https://github.com/codevise/pageflow/pull/625))
- Rename .css.scss files to just .scss
  ([#613](https://github.com/codevise/pageflow/pull/613))
- Ignore a few more files
  ([#565](https://github.com/codevise/pageflow/pull/565))
- Increase the test coverage
  ([#603](https://github.com/codevise/pageflow/pull/603),
   [#604](https://github.com/codevise/pageflow/pull/604))
- Bug fix: Narrow sprockets-rails version
  ([#546](https://github.com/codevise/pageflow/pull/546))

### Version 0.10.0

2016-06-09

[Compare changes](https://github.com/codevise/pageflow/compare/v0.9.0...v0.10.0)

##### Breaking Changes

- Except for icon fonts, Pageflow now only packages the Source Sans
  Pro font, which is used by the default theme. If your theme depends
  on one of the additional fonts that were included so far, you need
  to supply these in your own app from now on.
  ([#498](https://github.com/codevise/pageflow/pull/498))

- HTML meta tags for published entries can now be configured in the
  Pageflow initializer. The partial
  `layouts/pageflow/_meta_tags.html.erb` is no longer used and can be
  removed.
  ([#508](https://github.com/codevise/pageflow/pull/508),
   [#517](https://github.com/codevise/pageflow/pull/517))

##### Manual Update Step

- Image file Paperclip attachments need to be refreshed to ensure the
  new `thumbnail_large` styles
  ([#466](https://github.com/codevise/pageflow/pull/466)) are present:

        $ bin/rake paperclip:refresh:thumbnails \
            CLASS=Pageflow::ImageFile \
            ATTACHMENT=processed_attachment \
            STYLES=thumbnail_large

        $ bin/rake paperclip:refresh:thumbnails \
            CLASS=Pageflow::VideoFile \
            ATTACHMENT=poster \
            STYLES=thumbnail_large

        $ bin/rake paperclip:refresh:thumbnails \
            CLASS=Pageflow::VideoFile \
            ATTACHMENT=thumbnail \
            STYLES=thumbnail_large

  If you use plugins that provide file types with thumbnails, you need
  to reprocess their attachments as well.

##### Public Site

- Support entries with multiple storylines
  ([#409](https://github.com/codevise/pageflow/pull/409),
   [#461](https://github.com/codevise/pageflow/pull/461),
   [#462](https://github.com/codevise/pageflow/pull/462),
   [#467](https://github.com/codevise/pageflow/pull/467),
   [#485](https://github.com/codevise/pageflow/pull/485))
- Display chapters of main storyline in overview
  ([#455](https://github.com/codevise/pageflow/pull/455))
- Add css class to prevent display of hidden text indicator
  ([#435](https://github.com/codevise/pageflow/pull/435))
- Use shared translations `pageflow-public-i18n` gem for published
  entries.
  ([#451](https://github.com/codevise/pageflow/pull/451),
   [#450](https://github.com/codevise/pageflow/pull/450),
   [#410](https://github.com/codevise/pageflow/pull/410))
- Fade scroll indicators on classic navigation bar
  ([#464](https://github.com/codevise/pageflow/pull/464))
- Bug fix: Ensure background videos loop on desktop safari 9
  ([#527](https://github.com/codevise/pageflow/pull/527))
- Bug fix: Use current entry in non-js media links, fix video tag
  rendering and apply password protection to non-js files pages.
  ([#530](https://github.com/codevise/pageflow/pull/530),
   [#529](https://github.com/codevise/pageflow/pull/529))
- Bug fix: Remove html entities from social share description
  ([#486](https://github.com/codevise/pageflow/pull/486))
- Bug fix: Prevent accessing password protected entries
  ([#483](https://github.com/codevise/pageflow/pull/483))
- Bug fix: Use history pushstateadapter on ios 8 and above
  ([#479](https://github.com/codevise/pageflow/pull/479))
- Bug fix: Use correct key in navigation share box
  ([#454](https://github.com/codevise/pageflow/pull/454))
- Bug fix: Replace source sans pro to support czech characters
  ([#497](https://github.com/codevise/pageflow/pull/497))
- Bug fix: Decouple overview and navigation widgets
  ([#505](https://github.com/codevise/pageflow/pull/505))
- Bug fix: Ensure delayed text is displayed id no css animation support
  ([#525](https://github.com/codevise/pageflow/pull/525))

##### Admin

- Add feature tab to entry admin
  ([#432](https://github.com/codevise/pageflow/pull/432))
- Allow associating multiple CNAMES with a theming
  ([#482](https://github.com/codevise/pageflow/pull/482))
- Improve feature state inheritance
  ([#528](https://github.com/codevise/pageflow/pull/528))
- Add inline help for account default widgets form
  ([#522](https://github.com/codevise/pageflow/pull/522))

##### Editor

- Scaffold pages and chapters in editor
  ([#456](https://github.com/codevise/pageflow/pull/456))
- Disallow links in overview description
  ([#440](https://github.com/codevise/pageflow/pull/440))
- Make page transitions to storylines more configurable
  ([#526](https://github.com/codevise/pageflow/pull/526))
- Add storyline help topic
  ([#460](https://github.com/codevise/pageflow/pull/460))
- Improve display of page type pictograms in select box
  ([#434](https://github.com/codevise/pageflow/pull/434))
- Improve reloading logic for widgets inside editor
  ([#429](https://github.com/codevise/pageflow/pull/429))
- Reload dynamically generated entry stylesheet
  ([#426](https://github.com/codevise/pageflow/pull/426))
- Improve inline help in forms
  ([#480](https://github.com/codevise/pageflow/pull/480))
- Debounce widget update in editor
  ([#444](https://github.com/codevise/pageflow/pull/444))
- Improve native scrolling prevention
  ([#477](https://github.com/codevise/pageflow/pull/477))
- Bug fix: Improve storyline management
  ([#515](https://github.com/codevise/pageflow/pull/515))
- Bug fix: Prevent creation of loops in the storyline hierarchy
  ([#533](https://github.com/codevise/pageflow/pull/533))
- Bug fix: Prevent edit lock warning when editing reused file
  ([#524](https://github.com/codevise/pageflow/pull/524))
- Make fetching other entries faster for file reuse
  ([#523](https://github.com/codevise/pageflow/pull/523))
- Bug fix: Optimize sidebar for text box compatibility
  ([#478](https://github.com/codevise/pageflow/pull/478))
- Bug fix: Fix editor blank slate background color
  ([#433](https://github.com/codevise/pageflow/pull/433))
- Bug fix: Offer original image for download in editor
  ([#442](https://github.com/codevise/pageflow/pull/442))
- Bug fix: Ensure pages are preloaded in editor after type change
  ([#430](https://github.com/codevise/pageflow/pull/430))
- Bug fix: Correctly detect links to prevent default for in editor
  ([#431](https://github.com/codevise/pageflow/pull/431))

##### Rails Engine

- Let page type opt out of default scroller creation
  ([#427](https://github.com/codevise/pageflow/pull/427))
- Add theme option to control page change at storyline boundaries
  ([#458](https://github.com/codevise/pageflow/pull/458))
- Allow registering default widget types in features
  ([#521](https://github.com/codevise/pageflow/pull/521))
- Add mixin to generate page type pictogram theme css
  ([#449](https://github.com/codevise/pageflow/pull/449))
- Introduce SCSS extendables
  ([#463](https://github.com/codevise/pageflow/pull/463))
- Introduce SCSS variables for page typography
  ([#520](https://github.com/codevise/pageflow/pull/520))
- Add image css classes to lazy load thumbnails
  ([#488](https://github.com/codevise/pageflow/pull/488))
- Add cleanup page type hook
  ([#489](https://github.com/codevise/pageflow/pull/489))
- Reorganize seed data
  ([#465](https://github.com/codevise/pageflow/pull/465),
   [#532](https://github.com/codevise/pageflow/pull/532))
- Allow using i18n-js in published entries.
  ([#531](https://github.com/codevise/pageflow/pull/531))
- Default implementation for editor page links collection and views
  ([#415](https://github.com/codevise/pageflow/pull/415))
- Implement options for disabling rich text and links in TextAreaInputView
  ([#404](https://github.com/codevise/pageflow/pull/404))
- Trigger event on editor api when chapter or page is added
  ([#457](https://github.com/codevise/pageflow/pull/457))
- Set PAGEFLOW_EDITOR global
  ([#428](https://github.com/codevise/pageflow/pull/428))
- Improve page navigation list widget
  ([#443](https://github.com/codevise/pageflow/pull/443))
- Also set filter css class on navigation bar item
  ([#459](https://github.com/codevise/pageflow/pull/459))
- Optionally specify a host for the dummy instance
  ([#503](https://github.com/codevise/pageflow/pull/503))
- Ensure multijson uses yajl JSON adapter.
  ([#487](https://github.com/codevise/pageflow/pull/487))
- Improve guides and specs
  ([#502](https://github.com/codevise/pageflow/pull/502),
   [#501](https://github.com/codevise/pageflow/pull/501),
   [#473](https://github.com/codevise/pageflow/pull/473),
   [#472](https://github.com/codevise/pageflow/pull/472),
   [#514](https://github.com/codevise/pageflow/pull/514))
- Improve test coverage of page type interface
  ([#518](https://github.com/codevise/pageflow/pull/518))
- Bug fix: Destroy dependent account objects
  ([#493](https://github.com/codevise/pageflow/pull/493))
- Bug fix: Prevent incorrectly called page type hook on manual start
  ([#441](https://github.com/codevise/pageflow/pull/441))
- Bug fix: Explicitly set available locales in config
  ([#452](https://github.com/codevise/pageflow/pull/452))
- Bug fix: Fix migration rename command in readme
  ([#448](https://github.com/codevise/pageflow/pull/448))

##### Internals

- Install semmy release rake tasks
  ([#534](https://github.com/codevise/pageflow/pull/534))
- Update travis to use ruby 2.1
  ([#506](https://github.com/codevise/pageflow/pull/506))

### Version 0.9.0

2015-10-23

[Compare changes](https://github.com/codevise/pageflow/compare/v0.8.0..v0.9.0)

##### Breaking Changes

- The internal links page type has been extracted to the
  [`pageflow-internal-links`](https://github.com/codevise/pageflow-internal-links)
  gem. ([#316](https://github.com/codevise/pageflow/pull/316)) Remove
  the following line from your Pageflow initializer:

        config.register_page_type(Pageflow::BuiltInPageType.internal_links)

  Then follow the instructions found in the gem's
  [README](https://github.com/codevise/pageflow-internal-links) to
  install the extracted page type.

##### Deprecations

- The configuration API for registering new page types has
  changed. Turn calls of the form

        config.register_page_type(Pageflow::Some.page_type)

  into

        config.page_types.register(Pageflow::Some.page_type)

  The old method still exists for now, but will be removed before
  version 1.0.
  ([#297](https://github.com/codevise/pageflow/pull/297))

##### Manual Update Step

- Some of the new features have to be enabled manually via the new
  feature toggle UI inside the admin. Visit the _Features_ tab on the
  account's admin page to view a list of available feature
  toggles.
- Image file Paperclip attachments need to be refreshed to ensure the
  new panorama styles
  ([#344](https://github.com/codevise/pageflow/pull/344)) are present:

        $ bin/rake paperclip:refresh:thumbnails \
            CLASS=Pageflow::ImageFile \
            ATTACHMENT=processed_attachment \
            STYLES=panorama_large,panorama_medium

##### Public Site

- Password protection for published entries.
  ([#301](https://github.com/codevise/pageflow/pull/301),
   [#304](https://github.com/codevise/pageflow/pull/304))
- Atmo audios spanning multiple pages.
  ([#332](https://github.com/codevise/pageflow/pull/332),
   [#361](https://github.com/codevise/pageflow/pull/361),
   [#422](https://github.com/codevise/pageflow/pull/422))
- Option to automatically change page on video end.
  ([#334](https://github.com/codevise/pageflow/pull/334),
   [#339](https://github.com/codevise/pageflow/pull/339))
- Option to fade in page titles after a delay.
  ([#338](https://github.com/codevise/pageflow/pull/338))
- Additional page transitions.
  ([#326](https://github.com/codevise/pageflow/pull/326),
   [#363](https://github.com/codevise/pageflow/pull/363),
   [#423](https://github.com/codevise/pageflow/pull/423))
- Make https mode configurable
  ([#403](https://github.com/codevise/pageflow/pull/403))
- Improve display of file rights.
  ([#300](https://github.com/codevise/pageflow/pull/300))
- Slideshow optimization to improve initial load time in large
  entries.
  ([#330](https://github.com/codevise/pageflow/pull/330),
   [#352](https://github.com/codevise/pageflow/pull/352))
- Minor improvements to the video page type.
  ([#355](https://github.com/codevise/pageflow/pull/355),
   [#333](https://github.com/codevise/pageflow/pull/333),
   [#357](https://github.com/codevise/pageflow/pull/357),
   [#353](https://github.com/codevise/pageflow/pull/353),
   [#331](https://github.com/codevise/pageflow/pull/331))
- Bug fix: Use large link thumbnail if hero argument is true
  ([#417](https://github.com/codevise/pageflow/pull/417))
- Bug fix: Use the current locale in meta tags
  ([#412](https://github.com/codevise/pageflow/pull/412))
- Bug fix: Ensure hidden text indicator is only visible on mobile
  ([#391](https://github.com/codevise/pageflow/pull/391))
- Bug fix: Fix copyright links in mobile navigation.
  ([#377](https://github.com/codevise/pageflow/pull/377))
- Bug fix: Find share target page in published revision
  ([#375](https://github.com/codevise/pageflow/pull/375))
- Bug fix: Improve local storage detection to prevent failure in
  Safari.
  ([#360](https://github.com/codevise/pageflow/pull/360))

##### Admin/Editor

- Duplicating entries.
  ([#372](https://github.com/codevise/pageflow/pull/372))
- Hotkey to edit the current page.
  ([#340](https://github.com/codevise/pageflow/pull/340))
- Optimized video resouce management in editor for large entries.
  ([#337](https://github.com/codevise/pageflow/pull/337))
- Implement remembering of scroll position in chapter overview
  ([#405](https://github.com/codevise/pageflow/pull/405))
- Prefill depublication date field to one year from now
  ([#392](https://github.com/codevise/pageflow/pull/392))
- Implement loading spinner for file reuse panel
  ([#387](https://github.com/codevise/pageflow/pull/387))
- Bug fix: Make edit widget view handle widgets with no available
  widget types
  ([#383](https://github.com/codevise/pageflow/pull/383))

##### Rails Engine

Public APIs to be used by Pageflow plugins:

- Introduce features API.
  ([#297](https://github.com/codevise/pageflow/pull/297),
   [#320](https://github.com/codevise/pageflow/pull/320),
   [#325](https://github.com/codevise/pageflow/pull/325),
   [#416](https://github.com/codevise/pageflow/pull/416))
- Introduce API for audio playback.
  ([#319](https://github.com/codevise/pageflow/pull/319),
   [#356](https://github.com/codevise/pageflow/pull/356))
- Add API to add inputs to admin forms.
  ([#421](https://github.com/codevise/pageflow/pull/421))
- Enhance API for page types to configure their scroller.
  ([#321](https://github.com/codevise/pageflow/pull/321),
   [#327](https://github.com/codevise/pageflow/pull/327),
   [#336](https://github.com/codevise/pageflow/pull/336))
- Introduce API to display multimedia alert.
  ([#359](https://github.com/codevise/pageflow/pull/359))
- Introduce API to register new page transitions.
  ([#326](https://github.com/codevise/pageflow/pull/326))
- Introduce history API with adapters for hash, push state and
  simulation.
  ([#322](https://github.com/codevise/pageflow/pull/322))
- Introduce page type API to manage internal links.
  ([#324](https://github.com/codevise/pageflow/pull/324))
- Introduce API to customize page change behavior via scrolling.
  ([#323](https://github.com/codevise/pageflow/pull/323))
- Record when an entry has first been published
  ([#419](https://github.com/codevise/pageflow/pull/419))
- Promote `pageflow.Object` to `application.js`.
  ([#296](https://github.com/codevise/pageflow/pull/296),
   [#298](https://github.com/codevise/pageflow/pull/298))
- Dispatch `page:update` event via `pageflow.events`.
  ([#302](https://github.com/codevise/pageflow/pull/302))
- Panorama image file style.
  ([#344](https://github.com/codevise/pageflow/pull/344))

Theme options:

- Add theme option to disable page change by scrolling.
  ([#349](https://github.com/codevise/pageflow/pull/349))
- Let themes disable hide text on swipe functionality.
  ([#358](https://github.com/codevise/pageflow/pull/358))
- Add theme options to configure orientation and display of scroll
  indicators.
  ([#329](https://github.com/codevise/pageflow/pull/329),
   [#397](https://github.com/codevise/pageflow/pull/397))
- For themes that support non-linear Pagefows, chapters can now be
  organized in a hierachy.
  ([#318](https://github.com/codevise/pageflow/pull/318),
   [#345](https://github.com/codevise/pageflow/pull/345),
   [#348](https://github.com/codevise/pageflow/pull/348))

Extracted reusable jQuery widgets:

- Fullscreen button.
  ([#350](https://github.com/codevise/pageflow/pull/350))
- Parent page button.
  ([#347](https://github.com/codevise/pageflow/pull/347))
- Additional player controls buttons.
  ([#346](https://github.com/codevise/pageflow/pull/346),
   [#362](https://github.com/codevise/pageflow/pull/362),
   [#354](https://github.com/codevise/pageflow/pull/354))
- Use top button to go to landing page.
  ([#351](https://github.com/codevise/pageflow/pull/351))
- Extract social share links into reusable partials.
  ([#335](https://github.com/codevise/pageflow/pull/335))

Reusable components for the editor Backbone application:

- Generic button and list views.
  ([#343](https://github.com/codevise/pageflow/pull/343))
- Generic reference input view.
  ([#342](https://github.com/codevise/pageflow/pull/342))
- Page attribute translation key prefixes
  ([#395](https://github.com/codevise/pageflow/pull/395))
- Add visible option for input backbone views.
  ([#341](https://github.com/codevise/pageflow/pull/341))
- Options for configuration editor tab groups.
  ([#328](https://github.com/codevise/pageflow/pull/328))
- Allow displaying custom views in the editor main region.
  ([#317](https://github.com/codevise/pageflow/pull/317))
- Add `appendSubview` method.
  ([#310](https://github.com/codevise/pageflow/pull/310))
- Improve `SubsetCollection`.
  ([#309](https://github.com/codevise/pageflow/pull/309))
- Bug fix: Fix editor bug in collection_view.js
  ([#382](https://github.com/codevise/pageflow/pull/382))
- Bug fix: Fix editor bug related to underscore.js
  ([#381](https://github.com/codevise/pageflow/pull/381))
- Bug fix: Set `isDestroying` before triggering `destroying` event.
  ([#312](https://github.com/codevise/pageflow/pull/312))
- Bug fix: Save `TextiInputView` on close.
  ([#311](https://github.com/codevise/pageflow/pull/311))

Enhancements for app development:

- Allow overriding attachments scope name.
  ([#303](https://github.com/codevise/pageflow/pull/303))
- Bug fix: Add spec fixtures required by factory girl to gem files.
  ([#370](https://github.com/codevise/pageflow/pull/370),
   [#371](https://github.com/codevise/pageflow/pull/371),
   [#368](https://github.com/codevise/pageflow/pull/368))
- Use environment variables for api keys in generated initializer.
  ([#306](https://github.com/codevise/pageflow/pull/306))
- Bug fix: Fix theme name replacement in generator
  ([#385](https://github.com/codevise/pageflow/pull/385))

##### Internals

- Include pageflow version in entry css url to invalidate CDN on gem
  updates.
  ([#376](https://github.com/codevise/pageflow/pull/376))
- Allow adding pageflow configure blocks in tests.
  ([#420](https://github.com/codevise/pageflow/pull/420))
- Improve stability of feature specs.
  ([#299](https://github.com/codevise/pageflow/pull/299))
- Disable bandwidth feature detection in test environment.
  ([#308](https://github.com/codevise/pageflow/pull/308))
- Add config files to perform rubocop checks with hound
  ([#390](https://github.com/codevise/pageflow/pull/390))
- Rename binstub directory back to bin
  ([#389](https://github.com/codevise/pageflow/pull/389))
- Replaced sample video with smaller file
  ([#386](https://github.com/codevise/pageflow/pull/386))
- Bug fix: Fix paperclip version to 4.2 until 4.3 issues are resolved.
  ([#307](https://github.com/codevise/pageflow/pull/307))

### Version 0.8.0

2015-05-28

[Compare changes](https://github.com/codevise/pageflow/compare/v0.7.2...v0.8.0)

##### Public Site

- Bug fix: Do not hang at loading spinner if local storage is not
  available.
  ([#295](https://github.com/codevise/pageflow/pull/295))
- Bug fix: Ensure correct social sharing images and descriptions are
  used.
  ([#288](https://github.com/codevise/pageflow/pull/288))
- Bug fix: Ensure audio page text is not hidden by player controls on
  mobile.
  ([#263](https://github.com/codevise/pageflow/pull/263),
   [#267](https://github.com/codevise/pageflow/pull/267))

##### Admin/Editor

- Use locale from request header if user has not selected one.
  ([#265](https://github.com/codevise/pageflow/pull/265))
- Performance improvement: Speed up file polling requests in editor.
  ([#276](https://github.com/codevise/pageflow/pull/276))

##### Rails Engine

- Allow exluding widgets from being rendered in the preview.
  ([#271](https://github.com/codevise/pageflow/pull/271))
- Authorize display of entry admin tabs.
  ([#272](https://github.com/codevise/pageflow/pull/272))
- Trigger `pageflow.events` Event when the multimedia alert is closed.
  ([#260](https://github.com/codevise/pageflow/pull/260))
- Pass page widget in context option of media events.
  ([#273](https://github.com/codevise/pageflow/pull/273))

##### Internals

- Upgrade to Paperclip 4.2 to improve temp file removal.
  ([#289](https://github.com/codevise/pageflow/pull/289))
- Include teaspoon javascript tests in travis run.
  ([#264](https://github.com/codevise/pageflow/pull/264),
   [#294](https://github.com/codevise/pageflow/pull/294))
- Use container based travis infrastructure and cache gem bundle
  between test runs.
  ([#270](https://github.com/codevise/pageflow/pull/270))
- Improve install instructions in README.
  ([#283](https://github.com/codevise/pageflow/pull/283),
   [#285](https://github.com/codevise/pageflow/pull/285),
   [#293](https://github.com/codevise/pageflow/pull/293))
- Bug fix: Reset capybara session before cleaning the database in
  tests.
  ([#269](https://github.com/codevise/pageflow/pull/269))
- Bug fix: Prevent order dependent test suite failures.
  ([#274](https://github.com/codevise/pageflow/pull/274))

### Version 0.7.2

2015-02-25

[Compare changes](https://github.com/codevise/pageflow/compare/v0.7.1...v0.7.2)

- Bug fix: Depend on version 1.x of `aws-sdk` gem.
  ([#259](https://github.com/codevise/pageflow/pull/259))

### Version 0.7.1

2015-02-19

[Compare changes](https://github.com/codevise/pageflow/compare/v0.7.0...v0.7.1)

- Bug fix: Make gem versions more specific.
  ([#254](https://github.com/codevise/pageflow/pull/254),
   [#256](https://github.com/codevise/pageflow/pull/256))
- Bug fix: Loosen JBuilder dependency.
  ([#257](https://github.com/codevise/pageflow/pull/257))
- Bug fix: Make custom Backbone Marionette renderer accept functions
  as templates.
  ([#252](https://github.com/codevise/pageflow/pull/252))

### Version 0.7.0

2015-02-03

[Compare changes](https://github.com/codevise/pageflow/compare/v0.6.0...v0.7.0)

##### Manual Update Step

- The locale can now be changed on a per user and per entry basis.
  ([#220](https://github.com/codevise/pageflow/pull/220))

  For language selection to work inside the admin, you need to add the
  following line to the setup block inside your
  `config/initializers/active_admin.rb` file:

        ActiveAdmin.setup do |config|
          Pageflow.active_admin_settings(config)

          # ...
        end

  So far `en` and `de` locales are supported. The default locale can
  be configured in your `config/application.rb` file just like for any
  other Rails app:

        config.i18n.default_locale = :de

  If you do not wish to allow users to change the locale setting, add
  the following line to your `config/initializers/pageflow.rb` file:

        # Make only some locales available
        config.available_locales = [:de]

- DOM Change: The
  [overview close button](https://github.com/codevise/pageflow/pull/220/files#diff-ff2814e1f24a8bc9a279aebdda1094cdR3)
  and
  [the scroll/hidden text indicators](https://github.com/codevise/pageflow/pull/220/files#diff-59509a460b3b5b90c4d7b46bcb906befL13)
  now use localizable texts instead of relying on text in
  images. Custom themes must either hide or style these texts.

##### Public Site

- Twitter share cards support.
  ([#218](https://github.com/codevise/pageflow/pull/218))
- Bug fix: Cache head fragment for different share targets.
  ([#243](https://github.com/codevise/pageflow/pull/243))
- Bug fix: Improve social sharing buttons.
  ([#246](https://github.com/codevise/pageflow/pull/246))
- Bug fix: Ensure target blank for content links.
  ([#233](https://github.com/codevise/pageflow/pull/233))
- Bug fix: Improve top margin of pages without title.
  ([#223](https://github.com/codevise/pageflow/pull/223))
- Bug fix: Correct width of title elements with text position right.
  ([#224](https://github.com/codevise/pageflow/pull/224))
- Bug fix: Correct logo height on mobile devices.
  ([#234](https://github.com/codevise/pageflow/pull/234))
- Bug fix: Prevent illegal UTF8 characters from causing javascript
  syntax errors.
  ([#238](https://github.com/codevise/pageflow/pull/238),
   [#239](https://github.com/codevise/pageflow/pull/239))

##### Admin/Editor

- Improved page type select drop down menu.
  ([#249](https://github.com/codevise/pageflow/pull/249))
- Improved extensible help dialog.
  ([#248](https://github.com/codevise/pageflow/pull/248))
- Update rich text editor.
  ([#232](https://github.com/codevise/pageflow/pull/232))
- Allow mailto protocol in content links.
  ([#245](https://github.com/codevise/pageflow/pull/245))
- Bug fix: Remove unused additional info box fields for background
  audio page type.
  ([#226](https://github.com/codevise/pageflow/pull/226))
- Bug fix: Allow unsetting the custom share image.
  ([#230](https://github.com/codevise/pageflow/pull/230))
- Bug fix: Do not display outdated data when visiting editor with
  browser back.
  ([#239](https://github.com/codevise/pageflow/pull/239))
- Bug fix: Stop edit lock polling when session expires.
  ([#240](https://github.com/codevise/pageflow/pull/240))
- Bug fix: Add missing en translations.
  ([#237](https://github.com/codevise/pageflow/pull/237),
   [#247](https://github.com/codevise/pageflow/pull/247))

##### Rails Engine

- New plugin method for configuration API.
  ([#244](https://github.com/codevise/pageflow/pull/244))
- Refactor default theme to ease importing additional files.
  ([#229](https://github.com/codevise/pageflow/pull/229))
- Dispatch media events on video/audio playback.
  ([#227](https://github.com/codevise/pageflow/pull/227))
- Remove unused page type engine base class.
  ([#225](https://github.com/codevise/pageflow/pull/225))
- Bug fix: Depend on working jquery-fileupload-rails patch level
  version.
  ([#235](https://github.com/codevise/pageflow/pull/235))

### Version 0.6.0

2014-12-15

[Compare changes](https://github.com/codevise/pageflow/compare/v0.5.0...v0.6.0)

##### Public Site

- Allow displaying a different poster image for video pages on mobile
  devices where autoplay is not supported.
  ([#143](https://github.com/codevise/pageflow/pull/143))
- Animate scrolling indicator initially.
  ([#144](https://github.com/codevise/pageflow/pull/144))
- Improve Facebook open graph meta tags.
  ([#157](https://github.com/codevise/pageflow/pull/157))
- Allow sharing individual pages and changing the share image.
  ([#206](https://github.com/codevise/pageflow/pull/206))
- Allow configuring position of background videos.
  ([#176](https://github.com/codevise/pageflow/pull/176))
- Allow emphasizing recently added pages.
  ([#195](https://github.com/codevise/pageflow/pull/195),
   [#214](https://github.com/codevise/pageflow/pull/214))
- Start at bottom of page when scrolling backwards.
  ([#178](https://github.com/codevise/pageflow/pull/178),
   [#184](https://github.com/codevise/pageflow/pull/184),
   [#185](https://github.com/codevise/pageflow/pull/185))
- Prevent search engine indexing of video/audio file pages.
  ([#219](https://github.com/codevise/pageflow/pull/219))
- Improve iOS 8 compatability.
  ([#186](https://github.com/codevise/pageflow/pull/186),
   [#199](https://github.com/codevise/pageflow/pull/199))
- Improve IE 11 compatability.
  ([#189](https://github.com/codevise/pageflow/pull/189))
- Bug fix: Let Favicon path point into theme directoy.
  ([#164](https://github.com/codevise/pageflow/pull/164))
- Bug fix: Correct position of video loading spinner.
  ([#141](https://github.com/codevise/pageflow/pull/141))
- Bug fix: Audio loop page did not loop.
  ([#147](https://github.com/codevise/pageflow/pull/147))
- Bug fix: Prevent resolving ready promise before dom ready event.
  ([#167](https://github.com/codevise/pageflow/pull/167))

##### Admin/Editor

- New background positioning dialog.
  ([#212](https://github.com/codevise/pageflow/pull/212))
- Extensible tab concept for account and entry admin view.
  ([#165](https://github.com/codevise/pageflow/pull/165))
- Improve editor preview when sidebar causes narrow display.
  ([#196](https://github.com/codevise/pageflow/pull/196))
- Editor UI improvements.
  ([#182](https://github.com/codevise/pageflow/pull/182),
   [#194](https://github.com/codevise/pageflow/pull/194),
   [#200](https://github.com/codevise/pageflow/pull/200),
   [#203](https://github.com/codevise/pageflow/pull/203),
   [#207](https://github.com/codevise/pageflow/pull/207),
   [#208](https://github.com/codevise/pageflow/pull/208),
   [#210](https://github.com/codevise/pageflow/pull/210),
   [#215](https://github.com/codevise/pageflow/pull/215))
- Bug fix: Audio kept playing in editor when chaning page type.
  ([#149](https://github.com/codevise/pageflow/pull/149))
- Bug fix: Do not display edit lock warning after reopening an entry
  in the same tab.
  ([#202](https://github.com/codevise/pageflow/pull/202))
- Bug fix: Do not pass obsolete page configurations to page type
  hooks.
  ([#204](https://github.com/codevise/pageflow/pull/204))
- Bug fix: Return to correct tab after file selection.
  ([#211](https://github.com/codevise/pageflow/pull/211))

##### Rails Engine

- Rails 4.1 compatibility.
  ([#161](https://github.com/codevise/pageflow/pull/161),
   [#162](https://github.com/codevise/pageflow/pull/162),
   [#197](https://github.com/codevise/pageflow/pull/197))
- Introduce plugin concept for ui widgets.
  ([#170](https://github.com/codevise/pageflow/pull/170),
   [#198](https://github.com/codevise/pageflow/pull/198))
- Dispatch global events for Pageflow extensions.
  ([#171](https://github.com/codevise/pageflow/pull/171))
- Allow widget types to add content to page head.
  ([#217](https://github.com/codevise/pageflow/pull/217))
- Richer CSS classes for theming of progress bars.
  ([#177](https://github.com/codevise/pageflow/pull/177))
- Allow special theming of first page of chapter.
  ([#151](https://github.com/codevise/pageflow/pull/151),
   [#209](https://github.com/codevise/pageflow/pull/209))
- Allow page types to control whether an inverted scrolling indicator
  is used.
  ([#180](https://github.com/codevise/pageflow/pull/180))
- Give page types access to scroller properties.
  ([#181](https://github.com/codevise/pageflow/pull/181))

##### Internals

- Extract reusable Backbone views from editor.
  ([#163](https://github.com/codevise/pageflow/pull/163))
- Improve Backbone form and tab views.
  ([#166](https://github.com/codevise/pageflow/pull/166),
   [#169](https://github.com/codevise/pageflow/pull/169))
- Include capybara webkit tests in travis run.
  ([#201](https://github.com/codevise/pageflow/pull/201))

### Version 0.5.0

2014-10-14

[Compare changes](https://github.com/codevise/pageflow/compare/v0.4.0...v0.5.0)

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

2014-09-08

[Compare changes](https://github.com/codevise/pageflow/compare/v0.3.0...v0.4.0)

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

2014-08-22

[Compare changes](https://github.com/codevise/pageflow/compare/v0.2.1...v0.3.0)

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

2014-07-25

[Compare changes](https://github.com/codevise/pageflow/compare/v0.2.0...v0.2.1)

- Update Zencoder gem to fix [Zencoder SSL issue](http://status.zencoder.com/events/84) ([#70](https://github.com/codevise/pageflow/pull/70)).

### Version 0.2.0

2014-07-18

[Compare changes](https://github.com/codevise/pageflow/compare/v0.1.0...v0.2.0)

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

2014-05-16

[Compare changes](https://github.com/codevise/pageflow/compare/v0.0.1...v0.1.0)

- `pageflow:install` generator now creates resque rake tasks.
- Configuration option to change email address user invitations are sent from.
- Improved asset precompilation for production environment.

### Version 0.0.1

2014-05-05

- Initial release
