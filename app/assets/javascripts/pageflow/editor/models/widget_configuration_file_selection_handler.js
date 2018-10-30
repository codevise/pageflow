pageflow.WidgetConfigurationFileSelectionHandler = function(options) {
  var widget = pageflow.entry.widgets.get(options.id);

  this.call = function(file) {
    widget.configuration.setReference(options.attributeName, file);
  };

  this.getReferer = function() {
    return '/widgets/' + widget.id;
  };
};

pageflow.editor.registerFileSelectionHandler(
  'widgetConfiguration',
  pageflow.WidgetConfigurationFileSelectionHandler
);
