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
      config.entry_types.register(Rainbow.entry_type)
    end
  end

  def self.entry_type
    Pageflow::EntryType.new(name: 'rainbow', # ... further options)
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

Pageflow can use any Rack app to render the entry. Pageflow also stores
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

### Rendered Fragments

To make the editor work for entries of a new entry type, we first need
to provide some partials that will be used while rendering the
editor. `EntryType` takes an `editor_fragment_renderer` option, which
accepts an object that implements the following methods:

* `head_fragment(entry)`: HTML included in the head element of the
  editor page. The returned HTML needs to include asset tags that load
  all JavaScript and CSS required for the editor.

* `body_fragment(entry)`: HTML included in the body element of the
  editor page. Can be used to include static seed data `script` tags.

* `seed_fragment(entry)`: JSON included in asynchronously fetched
  editor seed data. Implement a `setupFromEntryTypeSeed` method as
  described below to access the data.

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
* `rainbow/editor/entries/_body.html.erb`
* `rainbow/editor/entries/_seed.json.jbuilder`

The given controller determines the available view helpers.

### Backbone Integration

Register the entry type in the editor JavaScript code loaded by the
editor head fragment:

```javascript
import {editor} from 'pageflow/editor;

import {RainbowEntry} from './models/RainbowEntry';

import {EntryOutlineView} from './views/EntryOutlineView';
import {EntryPreviewView} from './views/EntryPreviewView';
import {appearanceInputs} from './helpers/appearanceInputs';

editor.registerEntryType('rainbow', {
  entryModel: RainbowEntry,

  previewView: EntryPreviewView,
  outlineView: EntryOutlineView,
  appearanceInputs: appearanceInputs
});
```

When the editor is started the `entryModel` is instanciated and passed
the seed data. Extend the `Entry` model provided by `pageflow/editor`.

```javascript
import {Entry} from 'pageflow/editor';

export const RainbowEntry = Entry.extend({
  setupFromEntryTypeSeed(seed) {
    // receives seed data rendered by editor seed fragment
  }
});
```

The preview and outline views need to be Backbone views that will
receive the entry via the `model` option.

Pageflow expects translation keys that are scoped to entry type. For
example, if we add an input to appearance inputs like this

``` javascript
const appearanceInputs = (tabView, _options) => {
  tabView.input('manual_start', CheckBoxInputView);
};
```

Pageflow is looking for translation keys of the form
`pageflow.entry_types.paged.editor.entry_metadata_configuration_attributes.manual_start.{inline_help,label}`.

The `browserNotSupportedView` is a Backbone view that will be displayed if the access to editor needs to be blocked due to browser compatibility issues.
```javascript
import {editor} from 'pageflow/editor;
import {browser} from 'pageflow/frontend';

import {BrowserNotSupportedView} from './views/BrowserNotSupportedView';

editor.registerEntryType('rainbow', {
  // ...

  isBrowserSupported() {
    return browser.has('some feature required to use the editor');
  },

  browserNotSupportedView: BrowserNotSupportedView
});
``` 

### REST Controllers

Entry types can define new editor controllers, which can then be used
by custom Backbone collections in the editor:

```ruby
module Rainbow
  module Editor
    class UnicornsController < ActionController::Base
    end
  end
end
```

It is recommended to put all editor controllers into a `Editor`
module. The easiest way is to use the routes defined by the entry type
Rails engine:

```ruby
# rainbow/config/routes.rb
scope module: 'editor' do
  resources :unicorns
end
```

The `scope` call is required to use controllers from the
`Rainbow::Editor` module. Pass the engine as `editor_app` when
registering the entry type:

```ruby
def entry_type
  Pageflow::EntryType.new(name: 'rainbow',
                          ...
                          editor_app: Rainbow::Engine)
end
```

The editor app will be mounted at
`/editor/entries/:id/<entry_type_name>/`. So the example above would
add the route `/editor/entries/:id/rainbow/unicorns`.

Pageflow provides the `Pageflow::EditorController` module to take care
of common editor controller concerns like:

* Authenticating the user
* Finding the entry from request params
* Authorizing the usere
* Ensuring the current user holds an edit lock for the entry

```ruby
module Rainbow
  module Editor
    class UnicornsController < ActionController::Base
      include Pageflow::EditorController

      def update
        @entry # => Pageflow::DraftEntry
      end
    end
  end
end
```

In controller specs, you can use
`Pageflow::EditorControllerTestHelper#authorize_for_editor_controller`
to make sure the test request is authorized for the action:

```ruby
require 'spec_helper'
require 'pageflow/editor_controller_test_helper'

module Rainbow
  RSpec.describe Editor::UnicornsController, type: :controller do
    include Pageflow::EditorControllerTestHelper

    routes { Rainbow::Engine.routes }

    describe '#create' do
      it 'succeeds' do
        entry = create(:entry)

        authorize_for_editor_controller(entry)
        post(:create, params: {entry_id: entry.id}, format: 'json')

        expect(response.status).to eq(204)
      end
    end
  end
end
```

For controller actions that do not alter data, you can consider
skipping edit lock verification:

```ruby
module Rainbow
  module Editor
    class UnicornsController < ActionController::Base
      include Pageflow::EditorController

      skip_before_action :verify_edit_lock, only: :show

      def show
      end
    end
  end
end
```

The `pageflow/editor` module provides mixins to build Backbone
collections and models that use these REST endpoints:

```javascript
import Backbone from 'backbone';
import {entryTypeEditorControllerUrl} from 'pageflow/editor';

export const Unicorn = Backbone.Model.extend({
  mixins: [
    entryTypeEditorControllerUrl.forModel({ressources: 'unicorns'})
  ]
});

export const UnicornsCollection = Backbone.Model.extend({
  mixins: [
    entryTypeEditorControllerUrl.forCollection({resources: 'unicorns'})
  ],

  model: Unicorn
});
```

## Customizing Configuration

### Scoping by Entry Type

For concepts like widget types or file types that are used across
entry types it can make sense to register certain types only for
specific entry types. This can be done using the `for_entry_type`
method:

```ruby
module Rainbow
  class Plugin < Pageflow::Plugin
    def configure(config)
      config.for_entry_type(Rainbow.entry_type) do |c|
        c.widget_type.register(Rainbow.navigation_widget_type)
      end
    end
  end
end
```

This will make sure the `Rainbow.navigation_widget_type` is only
available for entries with of type `Rainbow.entry_type`.

### Adding to the Configuration

Entry types can introduce new concepts that can be represented in
Pageflow's configuration objects by providing a class that mixes in
`Pageflow::EntryTypeConfiguration`:

``` ruby
module Rainbow
  def self.entry_type
    Pageflow::EntryType.new(name: 'rainbow',
                            ...
                            configuration: Rainbow::Configuration)
  end

  class Configuration
    include Pageflow::EntryTypeConfiguration

    attr_reader :unicorns

    def initialize(*)
      super
      @unicorns = Unicorns.new
    end
  end
end
```

In plugins or host applications these settings can accessed using the
`for_entry_type` method:

```ruby
# host_app/config/initializers/pageflow.rb
Pageflow.configure do |config|
  config.for_entry_type(Rainbow.entry_type) do |c|
    c.unicorns.register # access methods defined by Rainbow::Unicorns
  end
end
```

When calling `Pageflow.config_for` with an entry of the fiven entry
type, the settings are also available:

```ruby
# assume
entry.entry_type # => Rainbow.entry_type

# then
Pageflow.config_for(entry).unicorns # access methods defined by Rainbow::Unicorns
```
