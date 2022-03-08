# Creating Widget Types

Widget types allow creating custom navigation bars or footers for
Pageflow Scrolled entries.

The following example places the widget type directly in the host
application. Widget types can also be [packaged as Rails
engines](../../../../doc/creating_a_pageflow_plugin_rails_engine.md). You
will then need custom JavaScript build tooling inside the engine to
make the widget type available to Webpack in the host application.

Widget types consist of the following elements:

* JavaScript for the frontend that provides React component to render
  the widget.

* CSS to style the widget. The recommended approach in Pageflow
  Scrolled is to use [CSS
  modules](https://github.com/css-modules/css-modules) which supported
  by Webpacker by default.

* A Ruby class defining a Pageflow plugin that can be registered in
  a host application's Pageflow initializer.

Assume we want to build a custom footer widget type called
`myFooter`. The typical directory layout in a host application looks
like this:

```
app/
  javascript/
    packs/
      pageflow-scrolled/
        widgets/
          myFooter.js
    widgets/
      myFooter.js
      myFooter.module.css

lib/
  my_footer_plugin.rb
```

## Frontend JavaScript

The widget type specific JavaScript code needs to be imported from two
places:

A pack file which will only be loaded in entries that use the widget
type. Pageflow expects the pack for the `myFooter` widget type to be
called `pageflow-scrolled/widgets/myFooter.js`:

``` javascript
// app/javascript/packs/pageflow-scrolled/widgets/myFooter.js

import '../../../widgets/myFooter.js';
```

Moreover, the widget type needs to be imported from the
`pageflow-scrolled-server.js` pack to ensure the widget type is
available for server side rendering:

``` javascript
// app/javascript/packs/pageflow-scrolled-server.js

import 'pageflow-scrolled/frontend-server';
// ...

// Add the following line
import '../widgets/myFooter.js';
```

Whether to place the actual widget type code in a
`app/javascript/widgets` as shown above or somewhere else is up to
you.  The imported file needs to register the widget type with the
frontend API:

``` jsx
// app/javascript/widgets/myFooter.js

import React from 'react';

import {frontend} from 'pageflow-scrolled/frontend';

import styles from './myFooter.module.css';

frontend.widgetTypes.register('myFooter', {
  component: function MyFooter() {
    return (
      <div className={styles.someStyle}>My Footer</div>
    )
  }
});
```

See the [API reference of
`pageflow-scrolled`](https://codevise.github.io/pageflow-docs/scrolled/js/master/index.html)
for a complete list of available components and hooks you can use in
your widget component.

## Creating the Plugin Class

Finally, we need to create a plugin class in our Ruby code that will
be referenced in the Pageflow initializer:

``` ruby
# lib/my_footer_plugin.rb
class MyFooterPugin < Pageflow::Plugin
  def configure(config)
    config.for_entry_type(PageflowScrolled.entry_type) do |entry_type_config|
      entry_type_config.widget_types.register(
        PageflowScrolled::ReactWidgetType.new(name: 'myFooter',
                                              role: 'footer')
      )
    end
  end

  def self.plugin
    Plugin.new
  end
end
```

The passed name has to match the widget type name passed to
`frontend.widgetTypes.register` in the JavaScript code. The second
parameter is the role of the widget type. For every entry there can
only be one widget of each role at a time. So far the following roles
are supported:

* `header`
* `footer`

Now the plugin can be used by host applications:

```ruby
# config/initializers/pageflow.rb
Pageflow.configure do |config|
  config.plugin(MyFooterPlugin.plugin)

  # ...
end
```

The following translations will be used as display names for the
widget type and its role in the admin and editor UI:

```
en:
  pageflow:
    my_footer:
      widget_type_name: "My Footer"
```

At this point widgets of the new type can be associated with entries
and will be rendered.

## Enabling Widgets by Default

Sometimes it can be desirable to define a default widget type to be
used for a specific role. This way, no manual configuration of entry
or theming is required for a widget to be rendered in all entries:

``` ruby
config.widget_types.register(
  PageflowScrolled::ReactWidgetType.new(name: 'myFooter',
                                        role: 'footer'),
  default: true
)

```

The default option registers the widget type as default choice for the
given role.
