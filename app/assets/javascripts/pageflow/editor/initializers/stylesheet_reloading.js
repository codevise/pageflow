pageflow.app.addInitializer(function(options) {
  pageflow.entry.on('change:pending_files_count', function(model, value) {
    if (value < pageflow.entry.previous('pending_files_count')) {
      pageflow.stylesheet.reload('entry');
    }
  });

  pageflow.entry.on('use:files', function() {
    pageflow.stylesheet.reload('entry');
  });

  pageflow.entry.configuration.on('change:theme_name', function() {
    var theme = pageflow.entry.getTheme();
    pageflow.stylesheet.update('theme', theme.get('stylesheet_path'));
  });
});
