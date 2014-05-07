# Pageflow

[![Gem Version](https://badge.fury.io/rb/pageflow.svg)](http://badge.fury.io/rb/pageflow)
[![Build Status](https://travis-ci.org/codevise/pageflow.svg?branch=master)](https://travis-ci.org/codevise/pageflow)

Multimedia story telling for the web.

For a high level introduction and example Pageflow stories see
[pageflow.io](http://pageflow.io) (German only at the moment).

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

* Ruby 1.9.3 or higher
* Rails 4.0
* Redis server (for Resque)
* A database server supported by Active Record (tested with MySQL)

Accounts of the following cloud services have to be registered:

* [Amazon Web Services](http://aws.amazon.com) for S3 file storage and
  (optionally) Cloudfront content delivery
* [Zencoder](http://zencoder.com) for video/audio encoding

## Installation

Add this line to your application's Gemfile:

    # Gemfile
    gem 'pageflow'

At the moment, Pageflow depends on a frozen version of Active Admin
since, back when development started, no Rails 4 compatible version of
Active Admin was available as a gem. You therefore need to bundle the
`rails4` branch that we have forked into our github organization:

    gem 'activeadmin', :git => 'https://github.com/codevise/active_admin.git', :branch => 'rails4'
    gem 'ransack'
    gem 'inherited_resources', '1.4.1'
    gem 'formtastic', '2.3.0.rc2'

Run bundler to install dependencies:

    $ bundle install

### Running the Generator

Now you can run the generator to setup Pageflow and its dependencies:

    $ rails generate pageflow:install

The generator will invoke Active Admin and Devise generators in turn
and apply some configuration changes.

To better understand Pageflow's configuration choices, you can run the
single steps of the `install` generator one by one. See the wiki page
[The Install Generator in Detail](https://github.com/codevise/pageflow/wiki/The-Install-Generator-in-Detail)
for more. If you'd rather not look behind the scenes for now, you can
safely read on for now.

## Database Setup

Now it's time to migrate the database.

    $ rake db:create db:migrate

If you do not like Rails' default database choices you might have to
alter your `database.yml` first.

Finally, you can populate the database with some example data, so
things do not look too blank in development mode.

    $ rake db:seed

## Configuration

Pageflow stores files in S3 buckets also in development
mode. Otherwise there's no way to have Zencoder encode them. See the
wiki page [Setting up external services](https://github.com/codevise/pageflow/wiki/Setting-up-External-Services).

For available configuration options and examples see the inline docs
in `config/initializers/pageflow.rb` in your generated rails app.

## Troubleshooting

If you run into problems during the installation of Pageflow, please refer to the [Troubleshooting](https://github.com/codevise/pageflow/wiki/Troubleshooting) wiki 
page. If that doesn't help, consider [filing an issue](https://github.com/codevise/pageflow/issues?state=open).
