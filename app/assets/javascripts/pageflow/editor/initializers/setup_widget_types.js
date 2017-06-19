pageflow.app.addInitializer(function(options) {
  pageflow.editor.widgetTypes.registerRole('navigation', {
    isOptional: true
  });

  pageflow.editor.widgetTypes.setup(options.widget_types);
});