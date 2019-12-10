# Creating Entry Types

**Entry types are currently work in progress and not ready to be used
in plugins**

Pageflow supports managing and publishing entries which use different
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

The following sections describe the available and required options.

## Implementing a Frontend

To render previews and published entries, add a Rails controller with
a `show` action. You can use all standard Rails features like views
and helpers.

When processing a request, Pageflow already takes care of things like
looking up the entry from the database and checking publication
state. Pageflow places the entry record on the request env before
delegating to your controller and provides a helper to obtain it:

```
module Rainbow
  class EntriesController < ActionController::Base
    include Pageflow::EntriesControllerEnvHelper

    def show
      @entry = get_published_entry_from_env
    end
  end
end
```

When defining your entry type, pass the controller action as
`frontend_app` option:

```
def entry_type
  Pageflow::EntryType.new(name: 'rainbow',
                          frontend_app: Rainbow::EntriesController.action(:show))
end
```

Pageflow can use any Rack app to render the entry. Pagefow also stores
a symbol on the request env which indicates whether currently a
preview or a publicly available site is rendered:

```
module Rainbow
  class EntriesController < ActionController::Base
    include Pageflow::EntriesControllerEnvHelper

    def show
      @mode = get_entry_mode_from_env # => either :published or :preview
    end
  end
end
```

There is also a test helper to invoke your controller action the same
way Pageflow does:

```
module Rainbow
  RSpec.describe EntriesController do
    routes { Engine.routes }
    render_views

    include Pageflow::EntriesControllerTestHelper

    describe '#show' do
      entry = create(:entry, :published)

      get_with_entry_env(:show, entry: entry, mode: :published, params: {some: 'param'})

      expect(response.body).to include(/something/)
    end
  end
end
```

## Customizing the Editor

To make the editor work for entries of a new entry type, we first need
to provide some partials that will be used while rendering the
editor. `EntryType` takes an `editor_fragment_renderer` option, which
accepts an object that implements the following methods:

* `head_fragment(entry)`: HTML included in the head element of the
  editor page. The returned HTML needs to include asset tags that load
  all JavaScript and CSS required for the editor.

Pageflow provides a helper class that can be used to render these
fragments from partials:

```ruby
def entry_type
  Pageflow::EntryType.new(name: 'rainbow',
                          ...
                          editor_fragment_renderer: editor_fragment_renderer)
end

def editor_fragment_renderer
  Pageflow::PartialEditorFragmentRenderer.new(Rainbow::Editor::EntriesController)
end
```

This will render the following partials with a local `entry` variable:

* `rainbow/editor/entries/_head.html.erb`

The given controller determines the available view helpers.
