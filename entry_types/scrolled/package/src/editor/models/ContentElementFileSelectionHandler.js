export const ContentElementFileSelectionHandler = function(options) {
  const contentElement = options.entry.contentElements.get(options.id);

  this.call = function(file) {
    contentElement.configuration.setReference(options.attributeName, file);
  };

  this.getReferer = function() {
    return '/scrolled/content_elements/' + contentElement.id;
  };
};
