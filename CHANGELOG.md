# CHANGELOG

### Version 12.1.0

2017-11-07

[Compare changes](https://github.com/codevise/pageflow/compare/12-0-stable...v12.1.0)

##### Manual Update Steps

- Include HLS in output presences of legacy files
  ([#872](https://github.com/codevise/pageflow/pull/872),
   [#867](https://github.com/codevise/pageflow/pull/867))

  The database migration for Pageflow 12.0 which updates output
  presences of existing video files is missing the HLS variant. This
  causes HLS urls of existing video files to be rendered as
  `undefined`.

  To apply the fix, install migrations and migrate your database. This
  fix has previously been released as part of version 12.0.2.

- Add Resque::Server to the generated routes
  ([#871](https://github.com/codevise/pageflow/pull/871))

  Mounting the Resque web server makes it easier to inspect background
  workers and restart jobs that have failed. See the issue description
  of [#856](https://github.com/codevise/pageflow/issues/856) on how to
  add this to existing apps.

##### Notable Changes

- The theme configured on account level now only acts as a default for
  new entries. After enabling the `selectable_themes` feature, a theme
  selection dialog is available inside the editor from the "Title and
  Options > Appearance" tab. The dialog allows configuring the theme
  on a per revision basis.
  ([#781](https://github.com/codevise/pageflow/pull/781),
   [#897](https://github.com/codevise/pageflow/pull/897))

##### Public Site

- Use page from url hash es landing page
  ([#832](https://github.com/codevise/pageflow/pull/832))
- Do not record history when changing pages via scrolling
  ([#831](https://github.com/codevise/pageflow/pull/831))
- Improve text tracks and info box display logic
  ([#826](https://github.com/codevise/pageflow/pull/826))
- Bug fix: Fix order of public i18n fallback
  ([#883](https://github.com/codevise/pageflow/pull/883))
- Bug fix: Prevent display of NaN duration in video controls
  ([#878](https://github.com/codevise/pageflow/pull/878))
- Bug fix: Prevent 404 when share image has been deleted
  ([#816](https://github.com/codevise/pageflow/pull/816))

##### Admin

- Use searchable select boxes in admin forms
  ([#888](https://github.com/codevise/pageflow/pull/888))
- Remove sensitive data from active admin downloads
  ([#899](https://github.com/codevise/pageflow/pull/899))
- Add config option to prevent multi account users
  ([#848](https://github.com/codevise/pageflow/pull/848),
   [#868](https://github.com/codevise/pageflow/pull/868))
- Add config options to restrict account manager permissions
  ([#849](https://github.com/codevise/pageflow/pull/849))
- Fix N+1 query in account admin users tab
  ([#877](https://github.com/codevise/pageflow/pull/877))
- Bug fix: Hide restore link and snapshot button for entry previewers
  ([#853](https://github.com/codevise/pageflow/pull/853))
- Bug fix: Use copy of current_user in profile form
  ([#850](https://github.com/codevise/pageflow/pull/850))
- Bug fix: Ensure new entry button is hidden for editors
  ([#847](https://github.com/codevise/pageflow/pull/847))
- Bug fix: Show folder edit button only for publishers and above
  ([#838](https://github.com/codevise/pageflow/pull/838))
- Bug fix: Allow :create entry only for publishers on accounts, not on entries
  ([#836](https://github.com/codevise/pageflow/pull/836))

##### Editor

- Widget configuration
  ([#694](https://github.com/codevise/pageflow/pull/694),
   [#809](https://github.com/codevise/pageflow/pull/809))
- Bug fix: Ensure page order in editor preview stays up to date
  ([#898](https://github.com/codevise/pageflow/pull/898))
- Bug fix: Switch off file meta data edit links when uploading
  ([#857](https://github.com/codevise/pageflow/pull/857))
- Bug fix: Improve polling for HostedFile state
  ([#822](https://github.com/codevise/pageflow/pull/822))
- Bug fix: Handle undefined page title.
  ([#763](https://github.com/codevise/pageflow/pull/763))

##### Media Stack

- Use relative urls inside dash and hls playlists
  ([#842](https://github.com/codevise/pageflow/pull/842))
- Use web audio api for volume fading if available
  ([#800](https://github.com/codevise/pageflow/pull/800),
   [#863](https://github.com/codevise/pageflow/pull/863))

##### File Processing

- Add panorama_mask image file style
  ([#830](https://github.com/codevise/pageflow/pull/830))
- Bug fix: Make url template generation more robust
  ([#876](https://github.com/codevise/pageflow/pull/876))

##### Rails Engine

- Themes can now be guarded by feature flags
  ([#765](https://github.com/codevise/pageflow/pull/765))
- Extend EncodingConfirmation by public account attribute
  ([#817](https://github.com/codevise/pageflow/pull/817))
- Extend query interface
  ([#815](https://github.com/codevise/pageflow/pull/815))
- Accept options for accounts admin menu via config
  ([#811](https://github.com/codevise/pageflow/pull/811))
- Add placeholder options to textareainputview
  ([#807](https://github.com/codevise/pageflow/pull/807))
- Call hook on entry publication
  ([#806](https://github.com/codevise/pageflow/pull/806))
- Add rake task and resque job to delete old auto snapshots
  ([#861](https://github.com/codevise/pageflow/pull/861),
   [#882](https://github.com/codevise/pageflow/pull/882))
- Generate a secure password in the seeds
  ([#775](https://github.com/codevise/pageflow/pull/775))

##### Theme Options

- Allow specifying opacity of image variant logo
  ([#799](https://github.com/codevise/pageflow/pull/799))
- Allow setting size of custom loading spinner background
  ([#798](https://github.com/codevise/pageflow/pull/798))
- Add theme option to right align logo in desktop layout
  ([#797](https://github.com/codevise/pageflow/pull/797))
- Add theme option to hide scroll indicator
  ([#790](https://github.com/codevise/pageflow/pull/790))
- Make content text max width configurable
  ([#780](https://github.com/codevise/pageflow/pull/780),
   [#804](https://github.com/codevise/pageflow/pull/804))

##### Documentation

- Import nginx-upload-module guide from wiki
  ([#814](https://github.com/codevise/pageflow/pull/814),
   [#821](https://github.com/codevise/pageflow/pull/821))
- Add documentation for versioning policy
  ([#866](https://github.com/codevise/pageflow/pull/866))
- Fix small typos
  ([#787](https://github.com/codevise/pageflow/pull/787))

##### Internals

- Precompile assets in Travis run
  ([#873](https://github.com/codevise/pageflow/pull/873))
- Test workflow improvements
  ([#803](https://github.com/codevise/pageflow/pull/803))
- Generate admins with account membership in specs
  ([#840](https://github.com/codevise/pageflow/pull/840))
- Use rails 4.2.9 in tests
  ([#837](https://github.com/codevise/pageflow/pull/837))
- Clean up memberships admin code
  ([#835](https://github.com/codevise/pageflow/pull/835))
- Basic tests for UsersTab add user button
  ([#805](https://github.com/codevise/pageflow/pull/805))
- Use codevise/teaspoon for logging backtraces on console
  ([#786](https://github.com/codevise/pageflow/pull/786))
- Split vendored code from our own
  ([#885](https://github.com/codevise/pageflow/pull/885))
- Introduce ApplicationRecord
  ([#889](https://github.com/codevise/pageflow/pull/889))
- Move configuration into a concern
  ([#794](https://github.com/codevise/pageflow/pull/794))
- Read the attribute instead of super
  ([#810](https://github.com/codevise/pageflow/pull/810))
- Destroy widgets when parent subject is destroyed
  ([#834](https://github.com/codevise/pageflow/pull/834))
- Fix dummy app generation on Travis for Rubygems 2.7
  ([#893](https://github.com/codevise/pageflow/pull/893))
- Update contents of gemspec
  ([#891](https://github.com/codevise/pageflow/pull/891))
- Bug fix: Work around breaking change in resque_mailer 2.4.3
  ([#894](https://github.com/codevise/pageflow/pull/894))

See
[12-0-stable](https://github.com/codevise/pageflow/blob/12-0-stable/CHANGELOG.md)
branch for previous changes.
