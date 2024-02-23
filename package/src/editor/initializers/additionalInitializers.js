import _ from 'underscore';

import {app} from '../app';
import {editor} from '../base';
import {state} from '$state';

app.addInitializer(function(/* args */) {
  var context = this;
  var args = arguments;

  _.each(editor.initializers, function(fn) {
    fn.call(context, {...args, entry: state.entry});
  });
});
