import {app} from '../app';

import {state} from '$state';

app.addInitializer(function(options) {
  state.entry.on('change:pending_files_count', function(model, value) {
    if (value < state.entry.previous('pending_files_count')) {
      pageflow.stylesheet.reload('entry');
    }
  });

  state.entry.on('use:files', function() {
    pageflow.stylesheet.reload('entry');
  });

  state.entry.metadata.on('change:theme_name', function() {
    var theme = state.entry.getTheme();
    pageflow.stylesheet.update('theme', theme.get('stylesheet_path'));
  });
});
