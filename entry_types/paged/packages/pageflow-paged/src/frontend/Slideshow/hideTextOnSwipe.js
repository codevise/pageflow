import jQuery from 'jquery';
import {hideText} from './hideText';

(function($) {
  $.widget('pageflow.hideTextOnSwipe', {
    _create: function() {
      this.element.swipeGesture({
        orientation: 'x',
        eventTargetSelector: this.options.eventTargetSelector
      });

      this.element.on('swipegestureleft', function() {
        hideText.activate();
      });

      this.element.on(
        'touchstart MSPointerDown pointerdown mousedown',
        this.options.eventTargetSelector,
        function() {
          if (hideText.isActive()) {
            hideText.deactivate();
          }
        }
      );

      this.element.on('scrollermove', function() {
        if (hideText.isActive()) {
          hideText.deactivate();
        }
      });
    }
  });
}(jQuery));
