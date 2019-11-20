# Rails Engine Development

## Installing Dependencies

Ensure the development machine meets the requirements listed in the
readme. From the repository root run:

    $ gem install bundler
    $ bundle install
    $ bin/npm install
    $ bin/yarn install

Build node packages to `assets` directory:

    $ bin/yarn run build
    $ bin/npm run build

## Running the Test Suite

Pageflow expects credentials of a MySQL user in the environment
variables `$PAGEFLOW_DB_USER` AND `PAGEFLOW_DB_PASSWORD`. By default
`"root"` and the empty password are used. If your MySQL is on a
different host, you can specify a MySQL host in the environment
variable `$PAGEFLOW_DB_HOST` and a port in `$PAGEFLOW_DB_PORT`
(default: 3306).

Use the binstubs to invoke the Ruby test suite

    $ bin/rspec

or the headless browser based Javascript test suite

    $ bin/teaspoon

Chrome 59 or newer has to be installed on the same computer you're running
the tests on.

The dummy Rails app used for tests is created automatically through the
install generator during test runs. To have it regenerated,
simply delete the contents of the `spec/dummy` directory. This is
required everytime new migrations are added or if tests are failing
after pulling changes into the local working tree.

## Developer console

An IRb console is available with all Pageflow classes loaded.
You can use this to try out any code you've touched.

    $ bin/console

## See Also

* [Running Pageflow From a Branch](running_pageflow_from_a_branch.md)
