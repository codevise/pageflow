(function($) {
  $.widget('pageflow.skipPageButton', {
    _create: function() {
      this.element.on('click', function() {
        pageflow.slides.next();
      });

      pageflow.events.on('page:change page:update', this.update, this);
      this.update();
    },

    _destroy: function() {
      pageflow.events.off(null, this.update);
    },

    update: function() {
      if (pageflow.slides) {
        this.element.toggleClass('enabled', !!pageflow.slides.nextPageExists());
      }
    }
  });
}(jQuery));