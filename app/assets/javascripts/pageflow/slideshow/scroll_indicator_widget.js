(function($) {
  $.widget('pageflow.scrollIndicator', {
    _create: function() {
      var parent = this.options.parent,
          that = this;

      parent.on('pageactivate', function(event) {
        var page = $(event.target);
        var invertIndicator = page.data('invertIndicator');

        if (typeof invertIndicator === 'undefined') {
          invertIndicator = page.hasClass('invert');
        }

        that.element.toggleClass('invert', invertIndicator);
      });

      parent.on('scrollerhintdown', function() {
        that.element.addClass('animate');
        setTimeout(function() {
          that.element.removeClass('animate');
        }, 500);
      });

      parent.on('scrollernearbottom', function(event) {
        var page = $(event.target).parents('section');

        if (page.hasClass('active')) {
          that.element.toggleClass('visible', parent.nextPageExists());
        }
      });

      parent.on('scrollernotnearbottom slideshowchangepage', function() {
        that.element.removeClass('visible');
      });
    }
  });
}(jQuery));