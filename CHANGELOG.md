# CHANGELOG

### Version 0.9.1

[Compare changes](https://github.com/codevise/pageflow/compare/v0.9.0...v0.9.1)

- Bug fix: Fix editor blank slate background color
  ([#436](https://github.com/codevise/pageflow/pull/436))

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
