pageflow.app.addInitializer(function(options) {
  pageflow.Audio.setup({
    getSources: function(audioFileId) {
      var file = pageflow.audioFiles.findWhere({perma_id: audioFileId});
      return file ? file.getSources() : '';
    }
  });
});