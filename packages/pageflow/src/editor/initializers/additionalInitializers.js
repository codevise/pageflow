import _ from 'underscore';

import {app} from '../app';
import {editor} from '../base';

app.addInitializer(function(/* args */) {
  var context = this;
  var args = arguments;

  _.each(editor.initializers, function(fn) {
    fn.call(context, args);
  });
});
