import {editor} from '../base';

import {state} from '$state';

export const PageLinkFileSelectionHandler = function(options) {
  var page = state.pages.getByPermaId(options.id.split(':')[0]);
  var pageLink = page.pageLinks().get(options.id);

  this.call = function(file) {
    pageLink.setReference(options.attributeName, file);
  };

  this.getReferer = function() {
    return '/page_links/' + pageLink.id;
  };
};

editor.registerFileSelectionHandler('pageLink', PageLinkFileSelectionHandler);
