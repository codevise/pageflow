import $ from 'jquery';
import _ from 'underscore';

import {editor} from 'pageflow/editor';

editor.addInitializer(function() {
  const scrollNavigationKeys = _.values({
    pageUp: 33,
    pageDown: 34,
    end: 35,
    home: 36,
    left: 37,
    up: 38,
    right: 39,
    down: 40
  });

  $('sidebar').on('keydown', function(event) {
    if (scrollNavigationKeys.indexOf(event.which) >= 0) {
      event.stopPropagation();
    }
  });
});
