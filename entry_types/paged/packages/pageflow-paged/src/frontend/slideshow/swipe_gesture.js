import jQuery from 'jquery';
import _ from 'underscore';

(function($) {
  $.widget('pageflow.swipeGesture', {
    _create: function() {
      var startX, startY, startTime,
          distX, distY;

      this.options = _.extend({
        orientation: 'x',
        minDist: 100,
        maxOrthogonalDist: 50,
        maxDuration: 500
      }, this.options);

      var selector = this.options.eventTargetSelector;

      this.element.on('touchstart MSPointerDown pointerdown', selector, _.bind(function(event) {
        if (isNonTouchPointer(event)) { return; }
        var point = event.originalEvent.touches ? event.originalEvent.touches[0] : event.originalEvent;

        startX = point.pageX;
        startY = point.pageY;

        distX = 0;
        distY = 0;

        startTime = new Date().getTime();
      }, this));

      this.element.on('touchmove MSPointerMove pointermove', selector, _.bind(function(event) {
        if (isNonTouchPointer(event)) { return; }
        var point = event.originalEvent.touches ? event.originalEvent.touches[0] : event.originalEvent;

        distX = point.pageX - startX;
        distY = point.pageY - startY;
      }, this));

      this.element.on('touchend MSPointerUp pointerup', selector, _.bind(function(event) {
        if (isNonTouchPointer(event)) { return; }
        var elapsedTime = new Date().getTime() - startTime;

        var dist = this.options.orientation === 'x' ? distX : distY;
        var orthogonalDist = this.options.orientation === 'x' ? distY : distX;

        if (Math.abs(dist) > this.options.minDist &&
            Math.abs(orthogonalDist) < this.options.maxOrthogonalDist &&
            elapsedTime < this.options.maxDuration) {

          if (this.options.orientation === 'x') {
            this._trigger(dist > 0 ? 'right' : 'left');
          }
          else {
            this._trigger(dist > 0 ? 'down' : 'up');
          }
        }
      }, this));

      function isNonTouchPointer(event) {
        return event.originalEvent.pointerType &&
          event.originalEvent.pointerType !== event.originalEvent.MSPOINTER_TYPE_TOUCH &&
          event.originalEvent.pointerType !== 'touch';
      }
    }
  });
}(jQuery));
