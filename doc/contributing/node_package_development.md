# Node Package Development

### Installing Dependencies

Ensure the development machine meets the requirements listed in the
readme. From the repository root run:

    $ yarn install

### Running the Test Suites

The Jest test suites need to be run from the respective package
roots. To run the specs from `./spec`:

    $ cd packages/pageflow
    $ yarn test

    $ cd entry_types/paged/packages/pageflow-paged
    $ yarn test

    $ cd packages/scrolled/package
    $ yarn test

The `pageflow-react` contains co-located tests inside
`packages/pageflow-react/src/**/__spec__` directories:

    $ cd packages/pageflow-react
    $ yarn test

### Running Development Watchers

To invoke the Rollup build when changing files, run the following
command from the repository root:

    $ yarn start

The Weback built for `pageflow-react` needs to be started separately:

    $ cd packages/pageflow-react
    $ yarn start

### Building for Release

To output a production ready build, run from the repository run:

    $ bin/build-packages

## See Also

* [Running Pageflow From a Branch](running_pageflow_from_a_branch.md)
