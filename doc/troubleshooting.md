## Application Setup

#### Do not Call your Generated Application `pageflow`

It leads to conflicting constant names and prevents the generator and the app from running.

**Solution**: `rails new pageflow_something` and NOT `rails new pageflow`

#### Devise Migration without File Extension

Some versions of Devise seem to generate a migration without a file extension. When running `migrate` the file is ignored causing the following migrations to fail.

**Solution**: Add `.rb` extension to `db/migrate/xxxx-devise_create_users` file.

#### Install Generator Fails

If you get the error message "Pageflow has not yet been configured" while running the generator, make sure you
are running in the `development` environment. When, for example, the `RAILS_ENV` environment variable is set to
`production`, the generator will fail.

## Image and Media Processing

#### Processing Progress in the Pageflow Editor Appears to be Stuck

* Ensure Resque worker and Resque scheduler processes are running. See ["Running Pageflow" section](https://github.com/codevise/pageflow#running-pageflow) in README on how to start all required processes.

#### Resque Worker cannot be Started

* `Error connecting to Redis on localhost:6379` when running `rake resque:work`

  **Solution**: Make sure Redis server is running.

* `rb_sys_fail_str(connect(2) for [fe80::1%lo0]:6379)` when running `rake resque:work`

  As reported in [redis/redis-rb#479](https://github.com/redis/redis-rb/issues/479) this
  error message is given on Max OS X Yosemite 10.10.1 with Ruby 2.1.0 when a Redis
  connection cannot be established.

  **Solution**: Make sure Redis server is running.

#### Error Message in Pageflow Editor during Upload Step

Files are uploaded directly to S3. So most upload related errors do not show up in the server logs.
Instead check for errors in the browser console and make sure the [S3 bucket configuration](https://github.com/codevise/pageflow/blob/master/doc/setting_up_external_services.md#bucket-configuration) is correct.

#### Error Message in Pageflow Editor during Processing Step

Check log entries prefixed with `[ActiveJob]` in`log/development.log` to see why the job failed.

* `NoMethodError (protected method around_validation called for #<StateMachine::Machine:0x007ffdc463f960>`

  Rails 4.2/Pageflow 12.x: Make sure you are using the fork of the `state_machine` gem found at
  `https://github.com/codevise/pageflow` as described in the install instructions.

* `Errno::ECONNREFUSED in Pageflow::Editor::FilesController#create` or hangs at `[paperclip] saving ...`

  Check that you have used a valid `s3_host_name` in Pageflow's `paperclip_s3_default_options` setting.
  In particular, ensure that you are not using an `s3-website.` endpoint. Those are only for serving
  files from the bucket via HTTP - not for API access. See the
  [AWS list of regions and enpoints](http://docs.aws.amazon.com/general/latest/gr/rande.html#s3_region)
  for possible values.

#### Error Message in Pageflow Editor during Image Processing Step

Check log entries prefixed with `[ActiveJob]` in`log/development.log` to see why the job failed.

* Ensure that ImageMagick is installed.

* Restart your Resque workers if you have changed the Paperclip configuration.

* Ensure there are no unwanted Resque worker processes still running, that might pick up jobs and fail silently.
  Run `ps aux | grep resque` to find such processes.

#### Error Message in Pageflow Editor during Video Processing Step

Check log entries prefixed with `[ActiveJob]` in`log/development.log` to see why the job failed.

* Zencoder failure after 4k video input

  You need to [opt-in for 4k video transcoding](https://app.zencoder.com/account/subscription) at Zencoder.
  4k video is billed at 4 times the rate of other formats (current as of March 2017)

## Server Side Rendering

#### Missing Precompiled Assets

Trying to display an entry results in an error message:

    ActionView::Template::Error: No compiled asset for react-server.js, was it precompiled?

**Solution**: In `config/initializers/assets.rb` add the following line:

    Rails.application.config.assets.precompile += %w(react-server.js components.js)

## Browser Console Error Messages

#### Bandwidth Probe Images Cannot be Found

When viewing an entry, the browser console contains an error of the form:

    GET http://com-example-pageflow-out.s3-website-eu-west-1.amazonaws.com/bandwidth_probe_small.png?1495014184536 404 (Not Found)

* Ensure the bandwidth probe files [have been placed in the S3 bucket](https://github.com/codevise/pageflow/wiki/Setting-up-External-Services#bandwidth-detection)

* If the bucket name in the URL does not match your current configuration, recompile the assets.
  URLs are written to Javascript during asset precompilation. Therefore configuration changes do not take
  effect immediately.

## Upgrading Pageflow

#### Missing Translations in Editor

Sometimes, after updating the `pageflow` gem or installing a new page type, missing translations appear inside the editor. This is caused by the `i18n-js` gem not picking up new translations. See the discussion in issue [#100](https://github.com/codevise/pageflow/issues/100) for some background.

**Solution**: Remove the sprockets cache directory located at `tmp/cache/assets/development/sprocket` and restart your app.

#### Missing Assets/Asset Changes in Development

Sometimes in `development` environment, Sprockets does not pick up changes in asset files, even though the `require`s match. A quickfix is to change something, e.g. add logging, in the root js/stylesheet/whatever asset type within your app that uses the `pageflow` gem or directly within the gem. Then save root js (or whatever) file, reload page, and Sprockets should pick up changes. Make sure to *not* remove this cache-breaking change you just did, otherwise you just run into the same old cache again.

In cases where this does not resolve the issue (e.g. due to caching multiple asset versions), you can delete the contents of `tmp/cache` in the app with which you are using `pageflow` or other `pageflow`-related gems. Caches will then be renewed on first request to app, which can take some time compared to the approach mentioned above -- but at least this is a surefire way that the assets you specified will be picked up.

## Running specs

#### This version of ChromeDriver only supports Chrome version XX

This is not about any chromedriver that you might have installed systemwide. Pageflow uses the `webdrivers` gem, which per default installs its own drivers and keeps them updated. According to `webdrivers`' documentation, we could expect that as soon as Selenium launches a browser, `webdrivers` checks for driver updates. However, sometimes, it seems it doesn't.

Solution -- update manually. Create a file with the following content, e.g. in `spec/support/pageflow/support/config`:

``` ruby
require 'webdrivers/chromedriver'

RSpec.configure do |config|
  config.before(:suite) do
    Webdrivers::Chromedriver.update
  end
end
```

Having done that, run the test suite.
