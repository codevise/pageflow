# CHANGELOG

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
