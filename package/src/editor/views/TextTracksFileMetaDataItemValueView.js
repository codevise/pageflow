import {FileMetaDataItemValueView} from './FileMetaDataItemValueView';

import {state} from '$state';

export const TextTracksFileMetaDataItemValueView = FileMetaDataItemValueView.extend({
  initialize: function() {
    this.textTrackFiles = this.model.nestedFiles(this.textTrackFilesOfEntry());
    this.listenTo(this.textTrackFiles, 'add remove change:configuration', this.update);
  },

  textTrackFilesOfEntry: function() {
    var otherEntry = this.model.collection?.entry;

    return otherEntry ?
           otherEntry.getFileCollection('text_track_files') :
           state.textTrackFiles;
  },

  getText: function() {
    return this.textTrackFiles.map(function(textTrackFile) {
      return textTrackFile.displayLabel();
    }).join(', ');
  }
});