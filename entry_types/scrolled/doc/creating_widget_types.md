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

* CSS to style the widget. The recommended approach for Pageflow
  Scrolled is to use [CSS
  modules](https://github.com/css-modules/css-modules) which is
  supported by Webpacker by default.

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
      <div className={styles.myFooter}>My Footer</div>
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

### Enabling Widgets by Default

Sometimes it can be desirable to define a default widget type to be
used for a specific role. This way, no manual configuration of entry
or site is required for a widget to be rendered in all entries:

``` ruby
config.widget_types.register(
  PageflowScrolled::ReactWidgetType.new(name: 'myFooter',
                                        role: 'footer'),
  default: true
)

```

The default option registers the widget type as default choice for the
given role.

## Theme Integration

CSS custom properties can be used to apply color and typography
related settings of the current theme.  The properties listed in the
["Custom Colors and Dimensions"
guide](./creating_themes/custom_colors_and_dimensions.md#available-properties),
correspond to CSS custom properties with a `--theme-` prefix. For
example, the value of the `widget_surface_color` property defined via

``` ruby
entry_type_config.themes.register(:default,
                                  # ...
                                  properties: {
                                    root: {
                                      # ...
                                      widget_surface_color: '#fff'
                                    },
                                  }
```

is available as the CSS custom property
`--theme-widget-surface-color`.

To apply the default widget font family (see ["Custom Typography"
guide](./creating_themes/custom_typography.md#custom-fonts)), add a
rule of the following form which applies to the root element of your
widget component:

``` css
.myFooter {
  font-family: var(--theme-widget-font-family);
}
```

Your widget can also define additional properties. It is recommended
to prefix these properties with the name of your widget.

``` css
.myFooter {
  height: var(--theme-my-footer-height, 100px);
}
```

When registering a theme in Ruby code, the property can now be defined
using the key `my_footer_height`.  Provide default values in your CSS
in case a theme does not define a value.

### Defining Scopes

As described in the ["Custom Colors and Dimensions"
guide](./creating_themes/custom_colors_and_dimensions.md#scopes),
scopes can be used to allow adapting certain properties only for a
specific widget type. To define a scope for your widget, compose a CSS
class of the following form in the rule that applies to the root
element of your widget component:

``` css
.myFooter {
  composes: scope-myFooter from global;

  background-color: var(--theme-widget-surface-color);
  color: var(--theme-widget-on-surface-color);
}
```

Theme authors can now change the surface color of the footer:

``` ruby
entry_type_config.themes.register(:my_custom_theme,
                                  # ...
                                  properties: {
                                    # ...

                                    my_footer: {
                                      # ...
                                      widget_surface_color: '#fdd'
                                    }
                                  }
```

### Defining Typography Rules

As described in the ["Custom Typography"
guide](./creating_themes/custom_typography.md#typography-rules),
typography rules let theme authors set typography related CSS
properties for certain classes of elements like headings or captions.
Your widget type can define additional typography rules, to allow
changing typography settings of certain elements. For example, to
allow styling certain links within your component, create a CSS rule
that composes a class of the following form using your widget name as
an infix:

``` css
.footerLink {
  composes: typography-myFooterLink from global;
}
```

Theme authors can now use the typography rule when registering a
theme:

``` ruby
entry_type_config.themes.register(:my_custom_theme,
                                  # ...
                                  typography: {
                                    # ...

                                    my_footer_link: {
                                      font_weight: 'bold'
                                    }
                                  }
```
