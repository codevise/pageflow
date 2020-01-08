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

    $ cd entry_types/scrolled/package
    $ yarn test

The `pageflow-react` contains co-located tests inside
`packages/pageflow-react/src/**/__spec__` directories:

    $ cd packages/pageflow-react
    $ yarn test

### Running Development Watchers

To invoke the Rollup build when changing files, run the following
command from the repository root:

    $ yarn start

The Webpack built for `pageflow-react` needs to be started separately:

    $ cd packages/pageflow-react
    $ yarn start

### Using Local Packages in a Host Application

To temporarily use a your local version of a package in a host
application, first run `yarn link` in the package directory:

    $ cd my-projects/pageflow/packages/pageflow
    $ yarn link

and

    $ cd my-projects/pageflow/entry_types/scrolled/package
    $ yarn link

In the host application run:

    $ cd my-projects/pageflow-host-app
    $ yarn link pageflow

and

    $ cd my-projects/pageflow-host-app
    $ yarn link pageflow-scrolled

Restart the development servers. Note that development watchers need
to be running for the pageflow repository. Run `yarn install` in the
host application.

You can return to using the version specified in the `package.json`
file, by running `yarn unlink pageflow`/`yarn unlink
pageflow-scrolled` and `yarn install --force`.

### Building for Release

To output a production ready build, run from the repository run:

    $ bin/build-packages

## See Also

* [Running Pageflow From a Branch](running_pageflow_from_a_branch.md)
