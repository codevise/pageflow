import {editor} from '../base';

import {state} from '$state';

export const EntryMetadataFileSelectionHandler = function(options) {
  this.call = function(file) {
    state.entry.metadata.setReference(options.attributeName, file);
  };

  this.getReferer = function() {
    return '/meta_data/' + (options.returnToTab || 'general');
  };
};

editor.registerFileSelectionHandler('entryMetadata', EntryMetadataFileSelectionHandler);
