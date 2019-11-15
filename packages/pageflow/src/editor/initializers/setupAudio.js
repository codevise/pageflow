import {app} from '../app';

import {state} from '$state';

app.addInitializer(function(options) {
  pageflow.Audio.setup({
    getSources: function(audioFileId) {
      var file = state.audioFiles.getByPermaId(audioFileId);
      return file ? file.getSources() : '';
    }
  });
});
