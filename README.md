# Pageflow

[![Gem Version](https://badge.fury.io/rb/pageflow.svg)](http://badge.fury.io/rb/pageflow)
[![Build Status](https://travis-ci.org/codevise/pageflow.svg?branch=master)](https://travis-ci.org/codevise/pageflow)
[![Coverage Status](https://coveralls.io/repos/github/codevise/pageflow/badge.svg?branch=master)](https://coveralls.io/github/codevise/pageflow?branch=master)
[![Code Climate](https://codeclimate.com/github/codevise/pageflow/badges/gpa.svg)](https://codeclimate.com/github/codevise/pageflow)
[![Reviewed by Hound](https://img.shields.io/badge/Reviewed_by-Hound-8E64B0.svg)](https://houndci.com)

Multimedia storytelling for the web. Built in cooperation with [WDR](https://wdr.de).

For a high level introduction and example Pageflow stories see
[pageflow.io](https://pageflow.io).

* [Getting Started](https://github.com/codevise/pageflow/wiki/Getting-Started)
* [Guides](https://github.com/codevise/pageflow/blob/master/doc/index.md)
* [JavaScript API Reference of `pageflow` package](http://codevise.github.io/pageflow-docs/js/master/index.html)
* [JavaScript API Reference of `pageflow-scrolled` package](http://codevise.github.io/pageflow-docs/scrolled/js/master/index.html)
* [Theme API Reference](http://codevise.github.io/pageflow-docs/theme/master/index.html)
* [List of Plugins](https://github.com/codevise/pageflow/wiki/List-of-Plugins)

## Updating

For instructions on how to update from a prior version of the gem see
the
[Updating Pageflow](https://github.com/codevise/pageflow/wiki/Updating-Pageflow)
wiki page.

## Ingredients

Pageflow is a Rails engine which roughly consists of the following
components:

* A full MVC stack to manage and display Pageflow stories
* User and permission management with support for isolated accounts
  and user collaboration
* A client side application for live preview editing of stories
* Background jobs to process and encode images, audios and videos
* Generators to quickly bootstrap a new Rails application

Pageflow assumes the following choice of libraries:

* [Devise](https://github.com/plataformatec/devise) for authentication
* [CanCanCan](https://github.com/CanCanCommunity/cancancan) for authorization
* [ActiveAdmin](http://activeadmin.info/) for administration
* [Resque](https://github.com/resque/resque) for as default for background jobs
* [FriendlyId](https://github.com/norman/friendly_id) for pretty URLs
* [Paperclip](https://github.com/thoughtbot/paperclip) for attachment handling
* [Backbone](http://backbonejs.org/) [Marionette](http://marionettejs.com/) for the editor
* [React](https://facebook.github.io/react/)/[Redux](http://redux.js.org/) for the frontend

## Requirements

Pageflow runs in environments with:

* Ruby >= 2.1 (see `.travis.yml` for supported versions)
* Node >= 10.0
* Rails 4.2
* Redis server (for Resque)
* A database server supported by Active Record (tested with MySQL)
* ImageMagick

Accounts of the following cloud services have to be registered:

* [Amazon Web Services](http://aws.amazon.com) for S3 file storage and
  (optionally) Cloudfront content delivery
* [Zencoder](http://zencoder.com) for video/audio encoding

## Installation

Generate a new Rails application using the MySQL database adapter:

    $ rails new my_pageflow --database=mysql
    $ cd my_pageflow

Do not name your application `"pageflow"` since it will cause conflicts
which constant names created by Pageflow itself.

### Database Setup

Enter valid MySQL credentials inside `config/database.yml` and create
the database:

    $ rake db:create

### Gem Dependencies

Add these lines to your application's Gemfile, replacing `X.Y.Z` with
the current Pageflow version number. It is recommended to depend on a
specific minor version using the pessimistic version constraint
operator. See Pageflow's
[versioning policy](https://github.com/codevise/pageflow/blob/master/doc/versioning_policy.md)
for details.

    # Gemfile
    gem 'pageflow', '~> X.Y.Z'

    # The install generator sets up Resque as Active Job backend
    gem 'resque', '~> 1.25'
    gem 'resque-scheduler', '~> 2.5'
    gem 'ar_after_transaction', '~> 0.5.0'
    gem 'redis', '~> 3.0'
    gem 'redis-namespace', '~> 1.5'

Run bundler to install dependencies:

    $ bundle install

### Running the Generator

Now you can run the generator to setup Pageflow and its dependencies:

    $ rails generate pageflow:install

The generator will invoke Active Admin and Devise generators in turn
and apply some configuration changes. When asked to overwrite the
`db/seeds.rb` file, choose yes.

To better understand Pageflow's configuration choices, you can run the
single steps of the `install` generator one by one. See the wiki page
[The Install Generator in Detail](https://github.com/codevise/pageflow/wiki/The-Install-Generator-in-Detail)
for more. If you'd rather not look behind the scenes for now, you can
safely read on.

### Database Migration

Now you can migrate the database.

    $ rake db:migrate

Finally, you can populate the database with some example data, so
things do not look too blank in development mode.

    $ rake db:seed

## Configuration

Pageflow stores files in S3 buckets also in development
mode. Otherwise there's no way to have Zencoder encode them. See
[setting up external services](./doc/setting_up_external_services.md).

The host application can utilize environment variables to configure the API keys for S3 and Zencoder. The variables can be found in the generated Pageflow initializer.

For available configuration options and examples see the inline docs
in `config/initializers/pageflow.rb` in your generated rails app.

Ensure you have defined default url options in your environments
files. Here is an example of `default_url_options` appropriate for a
development environment in `config/environments/development.rb`:

    config.action_mailer.default_url_options = {host: 'localhost:3000'}

In production, `:host` should be set to the actual host of your
application.

## Running Pageflow

In addition to the Rails server, you need to start two Rake tasks for
the background job processing. These tasks are listed in `Procfile` which
is generated in the project root folder by the Pageflow installer.

Consider using the [foreman gem](https://github.com/ddollar/foreman) to start all of
these processes (including the Rails server) with a single command in your
development environment.

The built-in Resque web server is mounted at `/background_jobs`. Use it to
inspect the state of background jobs, and restart failed jobs. This functionality
is only available for admins.

## Troubleshooting

If you run into problems during the installation of Pageflow, please refer to the [Troubleshooting](doc/troubleshooting.md) docs. If that doesn't help, consider [filing an issue](https://github.com/codevise/pageflow/issues?state=open).

## Security Policy

For major security issues, at least the current release series and the
last major series will receive patches and new versions.

Security related announcements will be posted to the
[`ruby-security-ann`](https://groups.google.com/forum/#!forum/ruby-security-ann)
mailing list.

If you have found a security related bug, please contact
`info(at)codevise.de` instead of creating a publicly visible issue.

## Contributing

Pull requests are welcome on GitHub at
https://github.com/codevise/pageflow. Everyone interacting in the
project's codebases, issue trackers and mailing lists is expected to
follow the
[code of conduct](https://github.com/codevise/pageflow/blob/master/CODE_OF_CONDUCT.md).

See the
[Contributing section](https://github.com/codevise/pageflow/blob/master/doc/index.md#contributing)
in the guides list for instructions on how to setup your development
environment. The
[GitHub wiki](https://github.com/codevise/pageflow/wiki#contributing-to-pageflow)
contains high level guides on common development workflows.

## License

The gem is available as open source under the terms of the
[MIT License](https://github.com/codevise/pageflow/blob/master/MIT-LICENSE).

## Special Thanks

Built in cooperation with:

[![WDR](doc/supporter_logos/wdr.png)](https://wdr.de)

We would like to express our special thanks to the following services
for supporting Pageflow through free open source plans:

[![BrowserStack](doc/supporter_logos/browser_stack.png)](https://browserstack.com)
[![Travis CI](doc/supporter_logos/travis_ci.png)](https://travis-ci.com/)
