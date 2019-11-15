import {editor} from '../base';

import {state} from '$state';

export const WidgetConfigurationFileSelectionHandler = function(options) {
  var widget = state.entry.widgets.get(options.id);

  this.call = function(file) {
    widget.configuration.setReference(options.attributeName, file);
  };

  this.getReferer = function() {
    return '/widgets/' + widget.id;
  };
};

editor.registerFileSelectionHandler(
  'widgetConfiguration',
  WidgetConfigurationFileSelectionHandler
);
