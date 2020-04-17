import jQuery from 'jquery';
import {state} from '../state';

(function($) {
  $.widget('pageflow.topButton', {
    _create: function() {
      var element = this.element;

      element.click(function(event) {
        state.slides.goToLandingPage();
        event.preventDefault();
      });

      state.slides.on('pageactivate', function(e, ui) {
        toggle();
      });

      toggle(state.slides.currentPage());

      function toggle() {
        var onLandingPage = state.slides.isOnLandingPage();

        element.toggleClass('deactivated', onLandingPage);
        element.attr('tabindex', onLandingPage ? '-1' : '2');
      }
    }
  });
}(jQuery));
