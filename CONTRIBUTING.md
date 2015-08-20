# Contributing to Pageflow

See the [GitHub wiki](https://github.com/codevise/pageflow/wiki) for details on how to contribute to Pageflow.

## Running the Test Suite

Pageflow expects credentials of a MySQL user in the environment
variables `$PAGEFLOW_DB_USER` AND `PAGEFLOW_DB_PASSWORD`. By default
`"root"` and the empty password are used.

Use the binstubs to invoke the Ruby test suite

    $ bin/rspec

or the headless browser based Javascript test suite

    $ bin/teaspoon

PhantomJS has to be installed on the system.

Pageflow can run its test suite against Rails 4.0 and 4.1
applications. The dummy app is created by a Rails template using the
`pageflow:install` generator. There are two ways to specify the Rails
version to develop and test against: Either set
`$PAGEFLOW_RAILS_VERSION` environment variable or create a
`.rails_version` file in the project root containing the Rails version
number. The environment variable takes precendence.

Remember to delete the ignored `Gemfile.lock` and running `bundle
install` after changing the Rails version through either of these
methods.
