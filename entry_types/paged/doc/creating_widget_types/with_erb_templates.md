# Creating Widget Types with ERB Templates

## Ingredients of a Widget Type

ERB template based widget types are
[packaged as Rails engines](../../../../doc/creating_a_pageflow_plugin_rails_engine.md)
that commonly contain the following elements:

* A Ruby class defining a Pageflow plugin that can be registered in
  a host application's Pageflow initializer.

* An ERB template to render the widget.

* JavaScript for the front end that progressively enhances the HTML.

* Locale files containing translations for the editor and admin UI.

* SCSS to be imported in Pageflow themes.

Optionally:

* JavaScript defining the editor integration for the widget type,
  e.g. available inputs to configure the widget.

In the following sections, we build an imaginary plugin called
`rainbow`. You can choose whatever name you like for your plugin
instead. Only be sure to name your root folder something other than
`pageflow` to prevent namespace conflicts with existing or future
Pageflow files.

## Creating the Plugin class

We start by creating a plugin class in our engine's Ruby code
that users of our plugin can reference in their Pageflow initializer:

```ruby
module Rainbow
  class Plugin < Pageflow::Plugin
    def configure(config)
      config.widget_types.register(Rainbow::WidgetType.new)
    end
  end

  class WidgetType < Pageflow::WidgetType
    def name
      'rainbow_bar'
    end

    def roles
      ['navigation']
    end

    def render(template, entry)
      # return html representation. For example:
      template.render('rainbow/widget.html.erb'
                      entry: entry)
    end
  end

  def self.plugin
    Plugin.new
  end
end
```

It is good practice to define a static factory method for the plugin
as above to be used in the Pageflow initializer:

```ruby
# config/initializers/pageflow.rb
Pageflow.configure do |config|
  config.plugin(Rainbow.plugin)
end
```

The following translations will be used as display names for the
widget type and its role in the admin and editor UI:

```
en:
  pageflow:
    widgets:
      roles:
        some_custom_role: "Display name of role"
    rainbow_bar:
      widget_type_name: "Rainbow Bar"
```

At this point widgets of the new type can be associated with entries
and will be rendered.

## Enhancing Widgets with Javascript

Most of the time the HTML of a widget has to be brought to live with
the help of some javascript. Pageflow allows a javascript function to
be registered which shall be executed to enhance the rendered HTML
snippet of a widget.

```ruby
// app/assets/javascript/rainbow.js
pageflow.widgetTypes.register('rainbow_bar', {
  enhance: function(element) {
    // some jQuery magic
  }
});
```

The name supplied to the register function has to match the one
returned by the `name` method of the widget type. Finally, to
determine which DOM element shall be passed to the `enhance` function,
mark up an element in the widget template with a `data-widget`
attribute matching the widget name.

```ruby
# app/views/rainbow/widget.html.erb
<div data-widget="rainbow_bar">
</div>
```

IMPORTANT: Widgets should only ever perform DOM manipulations inside of the
`element` passed to `enhance`. Making changes to DOM elements in other
widgets or pages breaks encapsulation, does not play well with widget
reloading inside the editor and might break React based functionality
of other pages or widgets.

## Adding Content to the Page Head

Widget types can contribute to the head of a published entry to add
script or meta tags.

```ruby
module Rainbow
  class WidgetType < Pageflow::WidgetType
    # ...

    def render_head_fragment(template, entry)
      # return html representation. For example:
      template.content_tag(:script, '', src: '//example.com/script.js')
    end
  end
end
```

## Excluding Widgets from Being Rendered in certain Scopes

Some widgets do not make sense in the context of the editor or the
preview, i.e. analytics snippets. Simply override `enabled_in_editor?`
or `enabled_in_preview?` inside your widget type and return `false`.

```ruby
module Rainbow
  class WidgetType < Pageflow::WidgetType
    # ...

    def enabled_in_editor?
      false
    end
  end
end
```

## Accessing Widget Configuration Data

For widget types that can be
[configured inside the editor](editor_integration.md), the configured
attributes can be accessed by overriding the `_with_configuration`
variants of the render methods.

Assume the following configuration editor has been registered for the
widget type:

```js
// rainbow/app/assets/javascripts/rainbow/editor.js
pageflow.editor.widgetTypes.register('rainbow_bar', {
  configurationEditorView: pageflow.ConfigurationEditorView.extend({
    configure: function() {
      this.tab('general', function() {
        this.input('name', pageflow.TextInputView);
      });
    }
  })
});
```

Then the widget type can be defined as:

```ruby
module Rainbow
  class WidgetType < Pageflow::WidgetType
    # ...

    def render_with_configuration(template, entry, configuration)
      configuration['name'] # => Configured text
      # ...
    end

    def render_head_fragment_with_configuration(template, entry, configuration)
      configuration['name'] # => Configured text
      # ...
    end
  end
end
```

## Further Steps

* [Theme Integration](theme_integration.md)
* [Widget Margins](widget_margins.md)
* [Enabling Widgets By Default](enabling_widgets_by_default.md)
* [Editor Integration](editor_integration.md)
