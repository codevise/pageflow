# Customizing Themes

Pageflow provides a Ruby API which allows overriding theme options on
a per account and entry type basis:

```
Pageflow.theme_customizations.update(account: some_account,
                                     entry_type: 'rainbow',
                                     overrides: {some: 'override'})
```

The provides overrides will be merged deepy into the theme options of
entries with the given type and acccount:

```
module Rainbow
  class EntriesController < ActionController::Base
    include Pageflow::EntriesControllerEnvHelper

    def show
      @entry = get_published_entry_from_env
      @entry.theme.options[:some] # => 'override'
    end
  end
end
```

Current settings can be read:

```
Pageflow.theme_customizations.get_overrides(account: some_account,
                                            entry_type: 'rainbow')
```
