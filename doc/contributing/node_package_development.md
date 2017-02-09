# Node Package Development

The repository contains bin stubs to run `npm` commands inside the
`node_package` directory.

## Installing Dependencies

Ensure the development machine meets the requirements listed in the
readme. From the repository root run:

    $ bin/npm install

## Running the Test Suite

The node package contains co-located tests inside
`node_package/src/**/__spec__` directories. Those can run from the
repository root:

    $ bin/npm test

## Running Development Watchers

To invoke the Webpack build and the test suite when changing files,
run the following command from the repository root:

    $ bin/npm start

## Building for Release

To output a production ready build, run:

    $ bin/npm build
