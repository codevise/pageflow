import $ from 'jquery';

import {app} from '../app';
import {editor} from '../base';

app.addInitializer(function(options) {
  var KEY_A = 65;
  var KEY_X = 88;

  $(document).on('keydown', function(event) {
    if (event.altKey && event.which === KEY_A) {
      if (pageflow.atmo.disabled) {
        pageflow.atmo.enable();
      }
      else {
        pageflow.atmo.disable();
      }
    }
    else if (event.altKey && event.which === KEY_X) {
      editor.navigate('pages/' + pageflow.slides.currentPage().data('id'), {trigger: true});
    }
  });
});