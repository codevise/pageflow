# Contributing to Pageflow

## Setting up your Fork

After forking the Pageflow repository to your own GitHub account,
create a clone on your machine:

    $ git clone git@github.com:your-account/pageflow.git
    $ cd pageflow

Add a remote named `upstream` to be able to pull changes from the
`codevise/pageflow` repository:

    $ git remote add upstream git@github.com:codevise/pageflow.git

## Updating your Fork

When changes have been made to the upstream repository, you can update
your fork by running:

    # ensure you are on branch master
    $ git checkout master

    # pull latest commit from codevise/pageflow
    $ git pull upstream master

    # bring your fork up to date
    $ git push origin master

## Creating a Pull Request

All your contributions should happen on feature branches. Your
`master` branch should only ever change by pulling commits from
`upstream` as described above.

    # ensure you are on branch master
    $ git checkout master

    # create a feature branch
    $ git checkout -b my-feature

    # make changes and commit
    $ git commit

    # push the feature branch to your fork
    $ git push origin

Now you can visit the GitHub repository page and create a pull request
from your feature branch. Be sure to provide a thorough explanation of
the changes you propose. Note that you can push further commits to
your branch to update the pull request.

Once the pull request is merged follow the steps above to update your
fork. `master` will now include your changes.

## Reviewing a Pull Request

Assume there is an open pull request:

> `some-user` wants to merge 3 commits into `codevise:master` from `some-user:feature-branch`

To review a pull request, you need an up to date Pageflow
application. See the README on how to install Pageflow into a new
Rails application.

    # got to your pageflow application
    $ cd my_pageflow

Now edit the `Gemfile` to use the feature branch inplace of the
`pageflow` gem:

    # Gemfile
    gem 'pagflow', git: 'https://github.com/some-user/pageflow.git', branch: 'feature-branch'

Update your application:

    $ bundle update pageflow

After restarting the server, your application now uses the pageflow
version from the feature branch.

Now test the changes described in the pull request and provide
feedback by commenting.
