pageflow.PageConfigurationFileSelectionHandler = function(options) {
  var page = pageflow.pages.get(options.id);

  this.call = function(file) {
    page.configuration.setReference(options.attributeName, file);
  };

  this.getReferer = function() {
    return '/pages/' + page.id + '/files';
  };
};

pageflow.editor.registerFileSelectionHandler('pageConfiguration', pageflow.PageConfigurationFileSelectionHandler);
