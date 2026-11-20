# Pageflow Scrolled

A continuously scrolled Pageflow entry type.

* [Guides](https://github.com/codevise/pageflow/blob/master/entry_types/scrolled/doc/index.md)
* [JavaScript API Reference](http://codevise.github.io/pageflow-docs/scrolled/js/master/index.html)

## Installation

Pageflow Scrolled is currently distributed as part of the `pageflow`
gem. The following steps assume that Pageflow has been set up already
in the host application. Pageflow Scrolled requires Shakapacker to be
installed in the host application. Add Shakapacker dependency to your
application's `Gemfile`:

```
gem 'shakapacker', '~> 10.3'
```

The Pageflow Scrolled install generator adds packages via Yarn. Unless
your application already has a `yarn.lock` file, declare Yarn as
package manager in your application's `package.json` file, since
Shakapacker uses npm otherwise:

```
{
  "packageManager": "yarn@1.22.22"
}
```

Run the Shakapacker install generator. Pageflow Scrolled extends the
webpack config. Since Shakapacker uses Rspack by default, pass
`webpack` as bundler:

```
$ bundle exec rake "shakapacker:install[webpack]"
```

React is required as a peer dependency of the `pageflow-scrolled`
package:

```
$ yarn add react@^16.13.1 react-dom@^16.13.1
```

Add the following lines to your application's `package.json` file to
depend on the `pageflow` and `pageflow-scrolled` packages which are
distributed as part of the `pageflow` gem:

```
{
  "scripts": {
    "preinstall": "bundle exec rake pageflow_scrolled:create_bundle_symlinks_for_yarn"
  },
  "dependencies": {
    ...
    "pageflow": "file:.bundle/for-yarn/pageflow/package",
    "pageflow-scrolled": "file:.bundle/for-yarn/pageflow/entry_types/scrolled/package",
    ...
  }
}
```

The preinstall script looks for `package.json` dependencies of the
form

```
.bundle/for-yarn/gem-name/package/path
```

and creates a symlink in the Git ignored directory `.bundle/for-yarn`
which points to the location of the gem as reported by `bundle show`.

Run the install generator for Pageflow Scrolled:

```
$ bundle exec rails generate pageflow_scrolled:install
```

## Development

See the
[Node Package Development guide](https://github.com/codevise/pageflow/blob/master/doc/contributing/node_package_development.md)
in the main engine documentation.

## Translations

Edit the translations directly on the
[pageflow_scrolled](http://www.localeapp.com/projects/public?search=tf/pageflow_scrolled)
LocaleApp project.
