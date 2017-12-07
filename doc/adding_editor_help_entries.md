# Adding Editor Help Entries

To add an item to editor's help dialog, define a plugin and register
the entry:

```ruby
# rainbow/lib/rainbow/plugin.rb
module Rainbow
  class Plugin < Pageflow::Plugin
    def configure(config)
      config.help_entries.register('pageflow.rainbow.help_entries.general', priority: 49)
    end
  end
end
```

Entries with high priority come first in the list.  The name of the
entry is interpreted as a translation key:

```yml
# config/locales/en.yml
en:
  pageflow:
    rainbow:
      help_entries:
        general:
          menu_item: "Name to display in the help index"
          text: "Contents of the help entry as Markdown."
```

The help index supports nesting entries:

```ruby
config.help_entries.register('pageflow.rainbow.help_entries.parent', priority: 49)
config.help_entries.register('pageflow.rainbow.help_entries.child',
                             parent: 'pageflow.rainbow.help_entries.parent')
```
