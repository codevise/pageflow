(function($) {
  $.widget('pageflow.fullscreenButton', {
    _create: function() {
      pageflow.fullscreen.on('change', this.update, this);
      this.update();

      this.element.click(function() {
        pageflow.fullscreen.toggle();
      });

      if (!pageflow.fullscreen.isSupported()) {
        this.element.css('visibility', 'hidden');
      }
    },

    _destroy: function() {
      pageflow.fullscreen.off('change', this.update);
    },

    update: function() {
      this.element
        .toggleClass('active', !!pageflow.fullscreen.isActive())
        .updateTitle();
    }
  });
}(jQuery));