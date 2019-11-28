# Node Package Development

## pageflow Package

The repository contains bin stubs to run `yarn` commands inside the
`packages/pageflow` directory.

### Installing Dependencies

Ensure the development machine meets the requirements listed in the
readme. From the repository root run:

    $ bin/yarn install

### Running the Test Suite

A Jest test suite lives in inside `packages/pageflow/spec`. It can run
from the repository root:

    $ bin/yarn test

### Running Development Watchers

To invoke the Rollup build when changing files, run the following
command from the repository root:

    $ bin/yarn start

### Building for Release

To output a production ready build, run:

    $ bin/yarn run build

## pageflow-react Package

The repository contains bin stubs to run `npm` commands inside the
`packages/pageflow-react` directory.

### Installing Dependencies

Ensure the development machine meets the requirements listed in the
readme. From the repository root run:

    $ bin/npm install

### Running the Test Suite

The node package contains co-located tests inside
`packages/pageflow-react/src/**/__spec__` directories. Those can run from the
repository root:

    $ bin/npm test

### Running Development Watchers

To invoke the Webpack build and the test suite when changing files,
run the following command from the repository root:

    $ bin/npm start

### Building for Release

To output a production ready build, run:

    $ bin/npm run build

## See Also

* [Running Pageflow From a Branch](running_pageflow_from_a_branch.md)
