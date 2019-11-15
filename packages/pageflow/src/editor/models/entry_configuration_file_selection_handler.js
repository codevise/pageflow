pageflow.EntryConfigurationFileSelectionHandler = function(options) {
  this.call = function(file) {
    pageflow.entry.configuration.setReference(options.attributeName, file);
  };

  this.getReferer = function() {
    return '/meta_data/' + (options.returnToTab || 'general');
  };
};

pageflow.editor.registerFileSelectionHandler('entryConfiguration', pageflow.EntryConfigurationFileSelectionHandler);
