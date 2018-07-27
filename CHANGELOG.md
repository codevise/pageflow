# CHANGELOG

### Unreleased Changes

[Compare changes](https://github.com/codevise/pageflow/compare/12-x-stable...master)

#### Manual Update Steps

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

See
[12-x-stable branch](https://github.com/codevise/pageflow/blob/12-x-stable/CHANGELOG.md)
for previous changes.
