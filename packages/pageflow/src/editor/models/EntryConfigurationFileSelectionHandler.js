import {editor} from '../base';

import {state} from '$state';

export const EntryConfigurationFileSelectionHandler = function(options) {
  this.call = function(file) {
    state.entry.configuration.setReference(options.attributeName, file);
  };

  this.getReferer = function() {
    return '/meta_data/' + (options.returnToTab || 'general');
  };
};

editor.registerFileSelectionHandler('entryConfiguration', EntryConfigurationFileSelectionHandler);
