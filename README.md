# Pageflow

[![Gem Version](https://badge.fury.io/rb/pageflow.svg)](http://badge.fury.io/rb/pageflow)
[![Build Status](https://travis-ci.org/codevise/pageflow.svg?branch=master)](https://travis-ci.org/codevise/pageflow)
[![Coverage Status](https://coveralls.io/repos/github/codevise/pageflow/badge.svg?branch=master)](https://coveralls.io/github/codevise/pageflow?branch=master)
[![Code Climate](https://codeclimate.com/github/codevise/pageflow/badges/gpa.svg)](https://codeclimate.com/github/codevise/pageflow)

Multimedia story telling for the web.

For a high level introduction and example Pageflow stories see
[pageflow.io](http://pageflow.io).

* [Getting Started](https://github.com/codevise/pageflow/wiki/Getting-Started)
* [Guides](https://github.com/codevise/pageflow/blob/master/doc/index.md)
* [Theme Settings](http://codevise.github.io/pageflow/theme/master/)

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
* [CanCan](https://github.com/ryanb/cancan) for authorization
* [ActiveAdmin](http://activeadmin.info/) for administration
* [Resque](https://github.com/resque/resque) for background jobs
* [FriendlyId](https://github.com/norman/friendly_id) for pretty URLs
* [Paperclip](https://github.com/thoughtbot/paperclip) for attachment handling
* [Backbone](http://backbonejs.org/) [Marionette](http://marionettejs.com/) for client side development

## Requirements

Pageflow runs in environments with:

* Ruby >= 1.9.3 and < 2.2.0 because of [ActiveAdmin](https://github.com/activeadmin/activeadmin/issues/3715)
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

Add this line to your application's Gemfile:

    # Gemfile
    gem 'pageflow'

    # Required for Rails 4.1:
    gem 'state_machine', git: 'https://github.com/codevise/state_machine.git'

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
mode. Otherwise there's no way to have Zencoder encode them. See the
wiki page [Setting up external services](https://github.com/codevise/pageflow/wiki/Setting-up-External-Services).

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

## Troubleshooting

If you run into problems during the installation of Pageflow, please refer to the [Troubleshooting](https://github.com/codevise/pageflow/wiki/Troubleshooting) wiki
page. If that doesn't help, consider [filing an issue](https://github.com/codevise/pageflow/issues?state=open).

## Special Thanks

We would like to express our special thanks to the following services
for supporting Pageflow through free open source plans:

[![BrowserStack](doc/supporter_logos/browser_stack.png)](https://browserstack.com)
[![Travis CI](doc/supporter_logos/travis_ci.png)](https://travis-ci.com/)
