import jQuery from 'jquery';
import {events} from 'pageflow/frontend';
import {state} from '../state';

(function($) {
  $.widget('pageflow.skipPageButton', {
    _create: function() {
      this.element.on('click', function() {
        state.slides.next();
      });

      events.on('page:change page:update', this.update, this);
      this.update();
    },

    _destroy: function() {
      events.off(null, this.update);
    },

    update: function() {
      if (state.slides) {
        this.element.toggleClass('enabled', !!state.slides.nextPageExists());
      }
    }
  });
}(jQuery));
