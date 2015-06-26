pageflow.app.addInitializer(function(options) {
  pageflow.Audio.setup({
    getSources: function(audioFileId) {
      var file = pageflow.audioFiles.get(audioFileId);
      return file ? file.getSources() : '';
    }
  });
});