# Versioning Policy

## For Plugins

From the point of view of Pageflow plugins, the `pageflow` gem follows
[semantic versioning](http://semver.org). Minor versions do not
introduce breaking changes to the API used by plugins. Every violation
of this principle is considered a bug.

So when developing a plugin, it is safe to depend on a specific major
version (i.e. `~> 12.0`). A plugin can also require a certain minor
version which introduced a certain feature that a plugin might depend
on (i.e. `~> 12.1`). If a plugin is known to work with multiple major
versions of Pageflow, it can depend on a range of major versions
(i.e. `['>= 12', '< 14']`).

## For Host Applications

From the point of view of Rails applications that depend on the Rails
engine provided by the `pageflow` gem, a pragmatic variation of the
semantic versioning strategy is applied.

- Patch level version updates: Only bug fixes, no API changes, no
  manual update steps, no new features, except as necessary for
  security features.

- Minior version updates: New features, no API changes, may require
  manual update steps.

- Major version updates: New features, likely to contain API changes
  and manual update steps.

Manual update steps include (but are not limited to) tasks like:

- Installing and running migrations

- Reprocessing Paperclip attachment styles

- Feature flag configuration via the admin interface

For host applications, it is thus recommended to depend on a specific
minor version of the `pageflow` gem (i.e. `~> 12.1.0`). That way patch
level updates can be applied automatically via `bundle update
pageflow`. For minor version updates, refer to the changelog for
manual upate instructions.
