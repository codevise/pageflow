# Running Pageflow from a Branch

Since the Webpack/Rollup build artifacts are ignored by Git, it is not
possible to simply reference `master` or any other branch inside a
Host application's `Gemfile`. Instead we need to create a so called
edge branch which contains a separate commit which adds these build
artifacts:

    $ git checkout -b some-feature
    $ bin/build-edge

The script ensures that the correct versions of all npm dependencies
are installed and performs a Webpack build before committing.

Build commits should never be included in PRs or merged into `master`.
