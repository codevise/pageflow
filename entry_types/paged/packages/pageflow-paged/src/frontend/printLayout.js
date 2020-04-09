import jQuery from 'jquery';
import {ready} from './ready';
/**
 * A promise that is resolved once the document is printed.
 */


// old promise not working properly, resolved in print-mode

/*  return new $.Deferred(function(deferred) {
    if (window.matchMedia) {
      var mediaQueryList = window.matchMedia('print');
      mediaQueryList.addListener(function(mql) {
        if (mql.matches) {
          deferred.resolve();
        }
      });
    }

    window.onbeforeprint = deferred.resolve;
  });
}; */

jQuery(function($) {

// now bound to pageflow.ready

  ready.then(function() {
    $('img.print_image').each(function() {
      var img = $(this);

      if (img.data('src')) {
        img.attr('src', img.data('printsrc'));
      }
    });
  });
});
