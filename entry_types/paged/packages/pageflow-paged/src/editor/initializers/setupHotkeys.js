import $ from 'jquery';

import {editor} from 'pageflow/editor';

import {state} from '$state';

editor.addInitializer(function(options) {
  var KEY_A = 65;
  var KEY_X = 88;

  $(document).on('keydown', function(event) {
    if (event.altKey && event.which === KEY_A) {
      if (state.atmo.disabled) {
        state.atmo.enable();
      }
      else {
        state.atmo.disable();
      }
    }
    else if (event.altKey && event.which === KEY_X) {
      editor.navigate('pages/' + state.slides.currentPage().data('id'), {trigger: true});
    }
  });
});
