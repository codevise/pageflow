# Widget Type Editor Integration

## Configurable Widgets

Widget type plugins can provide a Backbone view which can be used to
configure a widget for an entry. Extending
`pageflow.ConfigurationEditorView` and overriding the `configure`
method, allows defining the structure of the edit form.

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

An edit button is displayed next to the widget type select box on the
appearance tab inside the editor.

## Optional Widget Type Roles

By default, no select box is displayed for roles that are only used by
one widget type. That way widget types that are
[enabled by default](enabling_widgets_by_default.md) and have no
alternative candidate do not clutter the list. To make the select
visible, the corresponding role has to be marked as optional:

```js
// rainbow/app/assets/javascripts/rainbow/editor.js
pageflow.editor.widgetTypes.registerRole('rainbow_widget', {
  isOptional: true
});
```
