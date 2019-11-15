import Backbone from 'backbone';

import {app} from '../app';
import {editor} from '../base';

app.addInitializer(function() {
  Backbone.history.on('route', function() {
    editor.applyDefaultHelpEntry();
  });
});