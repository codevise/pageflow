pageflow.app.addInitializer(function() {
  Backbone.history.on('route', function() {
    pageflow.editor.applyDefaultHelpEntry();
  });
});