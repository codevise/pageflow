(function($) {
  $.widget('pageflow.hideTextOnSwipe', {
    _create: function() {
      this.element.swipeGesture({
        orientation: 'x',
        eventTargetSelector: this.options.eventTargetSelector
      });

      this.element.on('swipegestureleft', function() {
        pageflow.hideText.activate();
      });

      this.element.on(
        'touchstart MSPointerDown pointerdown mousedown',
        this.options.eventTargetSelector,
        function() {
          if (pageflow.hideText.isActive()) {
            pageflow.hideText.deactivate();
          }
        }
      );

      this.element.on('scrollermove', function() {
        if (pageflow.hideText.isActive()) {
          pageflow.hideText.deactivate();
        }
      });
    }
  });
}(jQuery));