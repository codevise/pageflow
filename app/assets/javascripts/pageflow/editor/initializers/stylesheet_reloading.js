pageflow.app.addInitializer(function(options) {
  pageflow.entry.on('change:pending_files_count', function(model, value) {
    if (value < pageflow.entry.previous('pending_files_count')) {
      pageflow.reloadStylesheet('entry');
    }
  });

  pageflow.entry.on('use:files', function() {
    pageflow.reloadStylesheet('entry');
  });
});