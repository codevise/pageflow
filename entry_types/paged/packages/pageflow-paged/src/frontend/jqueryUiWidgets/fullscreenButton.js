import jQuery from 'jquery';
import {fullscreen} from '../fullscreen';

(function($) {
  $.widget('pageflow.fullscreenButton', {
    _create: function() {
      fullscreen.on('change', this.update, this);
      this.update();

      this.element.click(function() {
        fullscreen.toggle();
      });

      if (!fullscreen.isSupported()) {
        this.element.css('visibility', 'hidden');
      }
    },

    _destroy: function() {
      fullscreen.off('change', this.update);
    },

    update: function() {
      this.element
        .toggleClass('active', !!fullscreen.isActive())
        .updateTitle();
    }
  });
}(jQuery));
