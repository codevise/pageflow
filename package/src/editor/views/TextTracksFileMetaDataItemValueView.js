import {FileMetaDataItemValueView} from './FileMetaDataItemValueView';

import {state} from '$state';

export const TextTracksFileMetaDataItemValueView = FileMetaDataItemValueView.extend({
  initialize: function() {
    this.textTrackFiles = this.model.nestedFiles(state.textTrackFiles);
    this.listenTo(this.textTrackFiles, 'add remove change:configuration', this.update);
  },

  getText: function() {
    return this.textTrackFiles.map(function(textTrackFile) {
      return textTrackFile.displayLabel();
    }).join(', ');
  }
});