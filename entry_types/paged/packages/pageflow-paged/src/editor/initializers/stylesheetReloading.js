import {editor, stylesheet} from 'pageflow/editor';

import {state} from '$state';

editor.addInitializer(function(options) {
  state.entry.on('change:pending_files_count', function(model, value) {
    if (value < state.entry.previous('pending_files_count')) {
      stylesheet.reload('entry');
    }
  });

  state.entry.on('use:files', function() {
    stylesheet.reload('entry');
  });

  state.entry.metadata.on('change:theme_name', function() {
    var theme = state.entry.getTheme();
    stylesheet.update('theme', theme.get('stylesheet_path'));
  });
});
