# CHANGELOG

### Unreleased Changes

[Compare changes](https://github.com/codevise/pageflow/compare/12-1-stable...master)

None so far.

See
[12-1-stable branch](https://github.com/codevise/pageflow/blob/12-1-stable/CHANGELOG.md)
for previous changes.

##### Manual Update Steps

- Atom feed
  ([#585](https://github.com/codevise/pageflow/issues/585))

  With the Atom feed, we need to introduce pagination. We chose [Kaminari](https://github.com/kaminari/kaminari) because it is already used by ActiveAdmin. Kaminari has a configuration file which you can generate and customize. This step has been added to the Pageflow installer.

  To generate the Kaminari configuration on an existing install, run `rails g kaminari:config`. If you are fine with the defaults, then there is no need to do this. Kaminari works fine without it.

  ##### Notable Changes

  - Atom feed
    ([#585](https://github.com/codevise/pageflow/issues/585))

  An [Atom feed](https://validator.w3.org/feed/docs/atom.html)([RFC](https://tools.ietf.org/html/rfc4287)) of published stories is now available. Every account will have their own feed. If a published story is protected by a password, it is excluded. Atom is a widely used standard to announce new publications. You could use it to automatically update a sidebar on a blog, for example.
