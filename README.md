# Pageflow

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

* [Devise](#) for authentication
* [CanCan](#) for authorization
* [Active](#) Admin for administration 
* [Resque](#) for background jobs
* [FriendlyId](#) for pretty URLs
* [Paperclip](#) for attachment handling
* [Backbone](#) Marionette for client side development

# Requirements

Pageflow runs in environments with:

* Ruby 1.9.3 or higher
* Rails 4.0
* Redis server (for Resque)
* A database server supported by Active Record (tested with MySQL)

Accounts of the following cloud services have to be registered:

* [Amazon Web Services](http://aws.amazon.com) for S3 file storage and
  (optionally) Cloudfront content delivery
* [Zencoder](http://zencoder.com) for video/audio encoding

# Installation

Add this line to your application's Gemfile:

    # Gemfile
    gem 'pagflow'

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

## One Stop Generator

Now you can run the generator to setup Pageflow and its dependencies:

    $ rails generate pageflow:install

The geneator will invoke Active Admin and Devise generators in turn
and apply some configuration changes.

## Step by Step Generators

To better understand Pageflow's configuration choices, you can run the
single steps of the `install` generator one by one. If you'd rather
not look behind the scenes for now, you can safely skip to the
configuration section.

Let's look at the steps one at a time.

    $ rails generate active_admin:devise User
    
Install devise and configure it to play nice with Active
Admin. Pageflow uses only a single `User` model with a configurable
role. So we tell Active Admin not create its default `AdminUser` model
but authenticate a `User` instead.

    $ rails generate active_admin:install --skip-users
    
This creates an initialzer for Active Admin and configures
routing. Pageflow brings its own user admin component. So there's no
need for the default user admin.

    $ rails generate friendly_id

Invoke the Friendly Id generator.

    $ rails generate pageflow:resque
    
Create initializers to configure Resque under
`config/initializers/resque_*`. Inside the initializers you find some
more explanations for the individual choices made.

    $ rails generate pageflow:assets
    
Create javascript and stylesheet files. Those mostly contain a single
`require` or `import` and are the place to include further Pageflow
extensions.

    $ rails generate pageflow:initializer
    
Create the Pageflow initializer which contains all configuration
options. All available settings are described inside the file.
    
    $ rails generate pageflow:routes

Inject the routes helper into `config/routes.rb`. Pageflow runs at the
root url by default.

    $ rails generate pageflow:cancan
    
Configure Active Admin to use the CanCan authorization adapter. And
create an `Ability` class.

    $ rails generate pageflow:user

Inject the Pageflow user mixin into the user class. As you can see
Pageflow works with `User` and `Ability` class that live in your
app. That way you can easily integrate new features into your app that
rely on Pageflow's user management.

    $ rake pageflow:install:migrations
    $ rake db:create db:migrate

Now it's time to migrate the database. If you do not like Rails'
default database choices you might have to alter your `database.yml`
first.

Finally, you can populate the database with some example data, so
things do not look too blank in development mode.

    $ rake db:seed
    
# Configuration

Pageflow stores files in S3 buckets also in development
mode. Otherwise there's no way to have Zencoder encode them. There is
a small guide on how to [setup external services](#). Once AWS and
Zencoder are in shape, you can tell Pageflow your credentials in
`config/initializers/pageflow.rb`.

Eventually you might be interested in some of these advanced
configuration possibilities:

* [Routing constraints to restrict access to non-public sites](#)
* [Advanced CDN configuration](#)
* [Increase upload speed using Nginx](#)

# Extending Pageflow

Pageflow's functionality can be extended:

* [Customizing themes for accounts](#)
* [Customizing views](#)
* [Adding new page types](#)
