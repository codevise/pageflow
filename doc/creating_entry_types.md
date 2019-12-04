# Creating Entry Types

Pageflow supports managing and publishing which use different
rendering logic and editor features. Entry types are packaged as Rails
engines just like other types of Pageflow plugins.

Conventionally, new entry types are registered in a plugin class:

```
module Rainbow
  class Plugin < Pageflow::Plugin
    def configure(config)
      config.entry_types.register(entry_type)
    end

    private

    def entry_type
      Pageflow::EntryType.new(name: 'rainbow', # ... further options)
    end
  end
end
```
