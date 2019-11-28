import {app} from '../app';
import {editor} from '../base';

app.addInitializer(function(options) {
  editor.widgetTypes.registerRole('navigation', {
    isOptional: true
  });

  editor.widgetTypes.setup(options.widget_types);
});