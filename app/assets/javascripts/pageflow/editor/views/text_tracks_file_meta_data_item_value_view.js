pageflow.TextTracksFileMetaDataItemValueView = pageflow.FileMetaDataItemValueView.extend({
  initialize: function() {
    this.textTrackFiles = this.model.nestedFiles(pageflow.textTrackFiles);
    this.listenTo(this.textTrackFiles, 'add remove change:configuration', this.update);
  },

  getText: function() {
    return this.textTrackFiles.map(function(textTrackFile) {
      return textTrackFile.displayLabel();
    }).join(', ');
  }
});