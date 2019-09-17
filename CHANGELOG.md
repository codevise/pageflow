# CHANGELOG

### Version 15.0.0.beta2

2019-08-01

[Compare changes](https://github.com/codevise/pageflow/compare/14-x-stable...v15.0.0.beta2)

- Move UsedFileTestHelper to support directory
  in order to make it available in Plugins.
  Require it in spec_helper to keep it available in Pageflow itself.

  ([#1194](https://github.com/codevise/pageflow/pull/1194))

- Remove default charset utf8mb3. This is motivated by the popularity
  of emoji, which utf8mb3 doesn't support. Note that from Rails 6
  onwards, for MySQL utf8mb4 is also the default [1]. For existing
  Pageflow instances, especially when using MySQL 5.5 or 5.6, a switch
  to utf8mb4 might work better after setting INNODB_LARGE_PREFIX and
  making related changes towards allowing a longer index key prefix
  [2], which in those versions isn't yet the default. For new
  installations, MySQL 5.7 is preferable to older versions, because,
  from a Rails perspective, it has 4-byte-character-friendlier default
  settings. Also see MySQL's official guide on converting between
  3-byte and 4-byte character sets [3].

  ([#1210](https://github.com/codevise/pageflow/pull/1194))

[1] https://github.com/rails/rails/pull/33608

[2] https://dev.mysql.com/doc/refman/5.5/en/innodb-parameters.html#sysvar_innodb_large_prefix

[3] https://dev.mysql.com/doc/refman/5.5/en/charset-unicode-conversion.html

See
[14-x-stable branch](https://github.com/codevise/pageflow/blob/14-x-stable/CHANGELOG.md)
for previous changes.
