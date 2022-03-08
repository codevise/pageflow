# Creating Widget Types with React Components

## Ingredients of a Widget Type

React-based widget types are
[packaged as Rails engines](../../../../doc/creating_a_pageflow_plugin_rails_engine.md)
that commonly contain the following elements:

* JavaScript for the front end that provides React components and other
  functionality that make up the widget.

* Locale files containing translations for the editor and admin UI.

* SCSS to be imported in Pageflow themes.

* A Ruby class defining a Pageflow plugin that can be registered in
  a host application's Pageflow initializer.

Optionally:

* JavaScript defining the editor integration for the widget type,
  e.g. available inputs to configure the widget.

In the following sections, we build an imaginary plugin called
`rainbow`. You can choose whatever name you like for your plugin
instead. Only be sure to name your root folder something other than
`pageflow` to prevent namespace conflicts with existing or future
Pageflow files.

## JavaScript Directory Layout

Let's create the minimal required JavaScript code for our page
type. The resulting directory structure inside our engine will look
like this:

```
rainbow/
  app/
    assets/
      javascripts/
        rainbow.js
        rainbow/
          components.jsx
          editor.js
```

The three files are used in different contexts:

* The main `rainbow.js` JavaScript file is supposed to be required in
  the `pageflow/application.js` file of host applications using our
  plugin. It provides everything that is needed for the page type to
  run inside the browser.

* `rainbow/components.js` is meant to be required from the host
  application's `components.js` file, which is loaded for server side
  rendering. At the moment, server side rendering of React based
  widgets is not yet supported. It is recommended, though, to follow
  the above convention for forward compatibility.

* Finally, the optional `editor.js` file contains code required to
  integrate the page type with the Pageflow editor and will be
  required in the host application's `pageflow/editor.js` file.

In the simplest case, `rainbow.js` only contains a `require` directive
to include `rainbow/components.js`

```js
// rainbow/app/assets/javascripts/rainbow.js
//= require ./rainbow/components
```

## Defining the Widget Component

To render the contents of our widget, we define a React component and
pass it to the `pageflow.react.createWidget` function. Note that we
can use ES6 syntax inside of `jsx` files:

```jsx
// rainbow/app/assets/javascripts/rainbow/components.jsx
(function() {
  function RainbowWidget(props) {
    return (
      <div>
        Render whatever you like here
      </div>
    );
  }

  const {registerWidgetType} = pageflow.react;

  registerWidgetType('rainbow_widget', {
    component: RainbowWidget
  });
}());
```

## Creating the Plugin Class

Finally, we need to create a plugin class in our engine's Ruby code
that users of our plugin can reference in their Pageflow initializer:

```ruby
# rainbow/lib/rainbow/some_plugin.rb
module Rainbow
  class Plugin < Pageflow::Plugin
    def configure(config)
      config.widget_types.register(Pageflow::React.create_widget_type('rainbow_widget', 'info_box'))
    end
  end

  def self.plugin
    Plugin.new
  end
end
```

The first argument passed to `create_widget_type` has to match the
widget type name passed to `registerWidgetType` in the JavaScript
code. The second parameter is the role of the widget type. For every
entry there can only be one widget of each role at a time.

Now the plugin can be used by host applications:

```ruby
# some_pageflow_app/config/initializers/pageflow.rb
Pageflow.configure do |config|
  config.plugin(Rainbow.plugin)

  # ...
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

## Accessing Widget Configuration Data

For widget types that can be
[configured inside the editor](editor_integration.md), the configured
attributes can be accessed by connecting the component to the Redux
store.

Assume the following configuration editor has been registered for the
widget type:

```js
// rainbow/app/assets/javascripts/rainbow/editor.js
pageflow.editor.widgetTypes.register('rainbow_widget', {
  configurationEditorView: pageflow.ConfigurationEditorView.extend({
    configure: function() {
      this.tab('general', function() {
        this.input('name', pageflow.TextInputView);
      });
    }
  })
});
```

Then the `widgetAttributes` selector can be used to retrieve the
corresponding data:

```js
(function() {
  function RainbowWidget(props) {
    return (
      <div>
        Hello {props.widget.name}!
      </div>
    );
  }

  const {registerWidgetType, connect, combine} = pageflow.react;
  const {widgetAttributes} = pageflow.react.selectors;

  registerWidgetType('rainbow_widget', {
    component: connect(combine({
      widget: widgetAttributes({role: 'info_box'})
    }))(RainbowWidget);
  });
}());
```

See [the guide on using selectors](../using_redux_selectors.md) for more
information.

## Further Steps

* [Theme Integration](theme_integration.md)
* [Widget Margins](widget_margins.md)
* [Enabling Widgets By Default](enabling_widgets_by_default.md)
* [Editor Integration](editor_integration.md)
