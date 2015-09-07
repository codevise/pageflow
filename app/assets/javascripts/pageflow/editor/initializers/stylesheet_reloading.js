pageflow.app.addInitializer(function(options) {
  pageflow.entry.on('change:pending_files_count', function(model, value) {
    if (value < pageflow.entry.previous('pending_files_count')) {
      pageflow.reloadStylesheet('entry');
    }
  });
});