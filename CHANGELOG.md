# CHANGELOG

### Version 13.0.0.rc1

2018-12-03

[Compare changes](https://github.com/codevise/pageflow/compare/v13.0.0.beta7...v13.0.0.rc1)

#### Breaking Changes

- Remove deprecated `HostedFile.columns` method
  ([#1085](https://github.com/codevise/pageflow/pull/1085))

  Migrations for models including `Pageflow::HostedFile` can no longer
  use `Pageflow::HostedFile.columns`. The call has to be replaced with
  the list of columns. See the
  [guide on creating files types](doc/creating_file_types.md) for an
  updated migration template.

- Remove `HostedFile#keep_on_filesystem_after_upload_to_s3`
  ([#1082](https://github.com/codevise/pageflow/pull/1082))

  Pageflow plugins defining file types need to change their jobs to
  redownload attachments for processing.

#### Published Entries

- Introduce widget insert points
  ([#1050](https://github.com/codevise/pageflow/pull/1050),
   [#1081](https://github.com/codevise/pageflow/pull/1081))
- Init page transitions after navigation direction
  ([#1047](https://github.com/codevise/pageflow/pull/1047))

#### Editor

- Add maxlength attribute to text input fields
  ([#1063](https://github.com/codevise/pageflow/pull/1063),
   [#1075](https://github.com/codevise/pageflow/pull/1075))

#### Admin

- Redirect to active tab when modifying revisions
  ([#1066](https://github.com/codevise/pageflow/pull/1066))
- Bug fix: Run checkbox toggle script for accounts only on new and edit
  ([#1072](https://github.com/codevise/pageflow/pull/1072))
- Bug fix: Fix flash notice on revision restore
  ([#1071](https://github.com/codevise/pageflow/pull/1071))
- Bug fix: Prevent class name collision in admin tabs view
  ([#1046](https://github.com/codevise/pageflow/pull/1046))

#### Rails Engine

- Fix example migration in file type guide
  ([#1087](https://github.com/codevise/pageflow/pull/1087))

#### Internal

- Add js feature spec for published entry
  ([#1049](https://github.com/codevise/pageflow/pull/1049))
- Fix bourbon deprecation warnings
  ([#1070](https://github.com/codevise/pageflow/pull/1070))
- Fix warnings caused by Enzyme 2.8.2
  ([#1053](https://github.com/codevise/pageflow/pull/1053))
- Make js specs fail on js errors
  ([#1048](https://github.com/codevise/pageflow/pull/1048),
   [#1086](https://github.com/codevise/pageflow/pull/1086))

### Version 13.0.0.beta7

2018-10-23

[Compare changes](https://github.com/codevise/pageflow/compare/v13.0.0.beta6...v13.0.0.beta7)

#### Breaking Changes

- Breaking change: Remove panorama mask image file style
  ([#1044](https://github.com/codevise/pageflow/pull/1044))

- Semi-official JavaScript API for registering custom page transitions
  changed
  ([#1043](https://github.com/codevise/pageflow/pull/1043),
   [#1045](https://github.com/codevise/pageflow/pull/1045))

#### Published Entries

- Option to allow horizontal swiping to change pages on phone
  ([#1040](https://github.com/codevise/pageflow/pull/1040),
   [#1042](https://github.com/codevise/pageflow/pull/1042),
   [#1041](https://github.com/codevise/pageflow/pull/1041))
- Use "swipe to continue" for scroll indicator on mobile
  ([#1037](https://github.com/codevise/pageflow/pull/1037))
- Prevent using desktop layout for landscape phones
  ([#1039](https://github.com/codevise/pageflow/pull/1039))
- Hide scroll indicator during video also on iOS
  ([#1038](https://github.com/codevise/pageflow/pull/1038))
- Make JSON seed safe to embed in html
  ([#1030](https://github.com/codevise/pageflow/pull/1030))
- Fix position of scroll indicator arrow icon
  ([#1021](https://github.com/codevise/pageflow/pull/1021))
- Improve iScroll
  ([#1020](https://github.com/codevise/pageflow/pull/1020))
- Improve quality of panorama image file styles
  ([#1019](https://github.com/codevise/pageflow/pull/1019))

#### Editor

- Add additionalInlineHelpText option to input views
  ([#1036](https://github.com/codevise/pageflow/pull/1036))
- Allow displaying help images in editor
  ([#1035](https://github.com/codevise/pageflow/pull/1035))
- Allow using html in infobox view
  ([#1034](https://github.com/codevise/pageflow/pull/1034))
- Add phone emulation mode to editor
  ([#1027](https://github.com/codevise/pageflow/pull/1027))
- Validate attachment presence for image and hosted files
  ([#1028](https://github.com/codevise/pageflow/pull/1028))
- Improve files js api
  ([#1025](https://github.com/codevise/pageflow/pull/1025))
- Add view to display unfinished file stages
  ([#1023](https://github.com/codevise/pageflow/pull/1023))
- Improve transient references
  ([#1022](https://github.com/codevise/pageflow/pull/1022))

#### Rails Engine

- Add shared example to pageflow-support to lint file types
  ([#1026](https://github.com/codevise/pageflow/pull/1026))
- Custom params for file types
  ([#1024](https://github.com/codevise/pageflow/pull/1024))
- File type background image rules for generated css
  ([#944](https://github.com/codevise/pageflow/pull/944))

#### Internal

- Add Ruby 2.5.3 to Travis file
  ([#1031](https://github.com/codevise/pageflow/pull/1031))
- Add "Reviewed by Hound" badge
  ([#1032](https://github.com/codevise/pageflow/pull/1032))
- Improve hosted file factory
  ([#1029](https://github.com/codevise/pageflow/pull/1029))

### Version 13.0.0.beta6

2018-10-18

[Compare changes](https://github.com/codevise/pageflow/compare/v13.0.0.beta5...v13.0.0.beta6)

- Relax Active Admin dependency
  ([#1012](https://github.com/codevise/pageflow/pull/1012))
- Add factory_bot dependency to pageflow-support
  ([#1014](https://github.com/codevise/pageflow/pull/1014))
- Rewrite factories to use dynamic attributes
  ([#1011](https://github.com/codevise/pageflow/pull/1011))
- Fix background color of form buttons in admin action items
  ([#991](https://github.com/codevise/pageflow/pull/991))
- Fix fragment caching for published entries
  ([#989](https://github.com/codevise/pageflow/pull/989))

### Version 13.0.0.beta5

2018-08-09

[Compare changes](https://github.com/codevise/pageflow/compare/v13.0.0.beta4...v13.0.0.beta5)

- Move config overrides for test env to pageflow-supprt
  ([#988](https://github.com/codevise/pageflow/pull/988))

### Version 13.0.0.beta4

2018-08-08

[Compare changes](https://github.com/codevise/pageflow/compare/v13.0.0.beta3...v13.0.0.beta4)

#### Manual Update Steps

- Upgraded to Paperclip 6.1
  ([#983](https://github.com/codevise/pageflow/pull/983))

  Set the name of the S3 region you are using in
  `config/initializers/pageflow.rb`. The complete configuration looks
  like this:

        config.paperclip_s3_default_options.merge!(
          s3_credentials: {
            bucket: ENV.fetch('S3_BUCKET', 'com-example-pageflow-development'),
            access_key_id: ENV.fetch('S3_ACCESS_KEY', 'xxx'),
            secret_access_key: ENV.fetch('S3_SECRET_KEY', 'xxx'),
          },
          s3_host_name: ENV.fetch('S3_HOST_NAME', 's3-eu-west-1.amazonaws.com'),
          s3_region: ENV.fetch('S3_REGION', 'eu-central-1'), # <= new line
          s3_host_alias: ENV.fetch('S3_HOST_ALIAS', 'com-example-pageflow.s3-website-eu-west-1.amazonaws.com'),
          s3_protocol: ENV.fetch('S3_PROTOCOL', 'http')
        )

- The `:host` interpolation has been renamed to `:pageflow_s3_root`.
  ([#985](https://github.com/codevise/pageflow/pull/985)

  Pageflow plugins using the interpolation in Paperclip options need
  to be updated.

- The name of the root folder in the S3 bucket needs to be configured
  explicitly.
  ([#985](https://github.com/codevise/pageflow/pull/985)

  Add the following code to your Pageflow initializer to keep using
  host specific root folders in development S3 buckets.

         config.paperclip_s3_root =
           if Rails.env.development?
             require 'socket'
             Socket.gethostname
           else
             'main'
           end

  This used to be the default behavior.

#### Rails Engine

- Allow using `sassc-rails`
  ([#982](https://github.com/codevise/pageflow/pull/982))

#### Internals

- Ensure `lib/pagefow` is eager loaded in production
  ([#984](https://github.com/codevise/pageflow/pull/984),
   [#987](https://github.com/codevise/pageflow/pull/987))

### Version 13.0.0.beta3

2018-07-31

[Compare changes](https://github.com/codevise/pageflow/compare/v13.0.0.beta2...v13.0.0.beta3)

#### Breaking Changes

- Migrated to `state_machines` gem
  ([#981](https://github.com/codevise/pageflow/pull/981))

  Pageflow no longer depends on a fork of the `state_machine` gem. The
  corresponding `Gemfile` entry has to be removed.

### Version 13.0.0.beta2

2018-07-31

[Compare changes](https://github.com/codevise/pageflow/compare/v13.0.0.beta1...v13.0.0.beta2)

- Require resque in initializer
  ([#980](https://github.com/codevise/pageflow/pull/980))
- Use `ar_after_transaction` 0.5
  ([#979](https://github.com/codevise/pageflow/pull/979))
- Fix handling of null object in presence validation
  ([#978](https://github.com/codevise/pageflow/pull/978))

### Version 13.0.0.beta1

2018-07-30

[Compare changes](https://github.com/codevise/pageflow/compare/12-x-stable...v13.0.0.beta1)

#### Breaking Changes

- All of the migrations of earlier versions have been consolidated
  into a single migration to speed up setup of new applications.
  ([#975](https://github.com/codevise/pageflow/pull/975))

  Make sure to update your application to Pageflow 12.2 before
  updating to 13.0 to make sure the host application contains all
  migrations.

- Upgraded to Rails 5.2 and Active Admin 1.3
  ([#938](https://github.com/codevise/pageflow/pull/938))

  Follow the Rails upgrade guide and review the Active Admin changelog
  to update the host application.

- Migrated from Resque to Active Job
  ([#976](https://github.com/codevise/pageflow/pull/976))

  Pageflow no longer depends on Resque, but can work with different
  Active Job backends instead. The install generator still sets up
  Resque as backend. To coninute using Resque in an existing
  application, you need to add the following dependencies to the host
  application's `Gemfile`:

        gem 'resque', '~> 1.25'
        gem 'resque-scheduler', '~> 2.5'
        gem 'ar_after_transaction', '~> 0.5.0'
        gem 'redis', '~> 3.0'
        gem 'redis-namespace', '~> 1.5'

  Then set Resque as default queue adapter in `config/application.rb`:

        config.active_job.queue_adapter = :resque

  The `resque-logger` and `resque_mailer` gems are no longer
  used. Their initializers need to be removed from the host
  application:

        $ rm config/initializers/resque_logger.rb
        $ rm config/initializers/resque_mailer.rb

  The following unused line has been removed from
  `Pageflow::AbilityMixin`:

        can(:manage, Resque) if user.admin?

  If the host application depends on this permission, you need to add
  it to the `Ability` yourself.

- Upgraded to Devise 4.4.0
  ([#932](https://github.com/codevise/pageflow/pull/932))

  Consider re-running the Devise intall generator to update the Devise
  initializer:

        $ bin/rails generate devise:install

- Devise Async has been removed
  ([#932](https://github.com/codevise/pageflow/pull/932))

  We now use Active Job to allow sending Devise mails in background
  jobs. The Device Async initializer (which was originally created by
  the `pageflow:install` generator) needs to be removed:

        $ rm config/initializers/device_async.rb

- The deprecated Factory Girl gem has been replaced with its successor
  Factory Bot. To continue using factories defined by Pageflow, you
  need to switch as well.
  ([#943](https://github.com/codevise/pageflow/pull/943))

#### Internals

- Fix building of nested associations
  ([#977](https://github.com/codevise/pageflow/pull/977))
- Upgrade Rubocop and remove imported Hound config
  ([#973](https://github.com/codevise/pageflow/pull/973))

See
[12-x-stable branch](https://github.com/codevise/pageflow/blob/12-x-stable/CHANGELOG.md)
for previous changes.
