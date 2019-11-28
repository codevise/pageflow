import {editor} from '../base';

import {state} from '$state';

export const PageConfigurationFileSelectionHandler = function(options) {
  var page = state.pages.get(options.id);

  this.call = function(file) {
    page.configuration.setReference(options.attributeName, file);
  };

  this.getReferer = function() {
    return '/pages/' + page.id + '/' + (options.returnToTab || 'files');
  };
};

editor.registerFileSelectionHandler('pageConfiguration', PageConfigurationFileSelectionHandler);
