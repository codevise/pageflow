pageflow.PageLinkFileSelectionHandler = function(options) {
  var page = pageflow.pages.getByPermaId(options.id.split(':')[0]);
  var pageLink = page.pageLinks().get(options.id);

  this.call = function(file) {
    pageLink.setReference(options.attributeName, file);
  };

  this.getReferer = function() {
    return '/page_links/' + pageLink.id;
  };
};

pageflow.editor.registerFileSelectionHandler('pageLink', pageflow.PageLinkFileSelectionHandler);
