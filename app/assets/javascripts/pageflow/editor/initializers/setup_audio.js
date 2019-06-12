pageflow.app.addInitializer(function(options) {
  pageflow.Audio.setup({
    getSources: function(audioFileId) {
      var file = pageflow.audioFiles.getByPermaId(audioFileId);
      return file ? file.getSources() : '';
    }
  });
});