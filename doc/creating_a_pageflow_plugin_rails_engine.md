# Creating a Pageflow Plugin Rails Engine

## Generate a New Gem

You'll have to distribute Pageflow plugins as a Rubygem; either if you
mean to share it with others like you, or keep the code private.  The
easiest way to go about this is to generate a gem, and then add the
Rails Engine parts in later.

``` bash
$ bundle gem some_plugin # your gem name will be different!
```

Fill in the missing fields in the gemspec that's created for you.
While you're in there, add `pageflow` as a dependency:

```ruby
# some_plugin.gemspec
spec.add_dependency 'pageflow', '~> x.y'
spec.add_dependency 'pageflow-public-i18n', '~> 1.0'
```

Where `x` is the current major and `y` is the minimal required minor
version of Pageflow your plugin depends on. If your gem supports
multiple major versions, specify an explicit range. For example, if
the latest released Pageflow version is `13.3` and your plugin
supports all versions equal to or above `12.1`:

```ruby
# some_plugin.gemspec
spec.add_dependency 'pageflow', ['>= 12.1', '< 14]'
```

Always use a pessimistic approach, excluding the next major version to
prevent your plugin from breaking applications. Explicitly check that
breaking changes in new major version releases do not effect your
plugin before extending the range.

## Rails Engine

Require the engine from your main file:

``` ruby
# lib/some_plugin.rb`
require some_plugin/engine'
```

And add it:

``` ruby
# lib/some_engine/engine.rb
require 'rails/engine'

module SomePlugin
  class Engine < ::Rails::Engine
    isolate_namespace SomePlugin

    # By default locales from sub directories are ignored
    config.i18n.load_path += Dir[config.root.join('config', 'locales', '**', '*.yml').to_s]
  end
end
```
