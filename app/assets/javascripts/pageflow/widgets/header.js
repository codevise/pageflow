jQuery(function($) {
  $.widget('pageflow.header', {
    _create: function() {
      var slideshow = this.options.slideshow,
          that = this;

    slideshow.on('pageactivate', function(event) {
        updateClasses($(event.target));
      });

      slideshow.on('scrollerneartop', function(event) {
        that.element.addClass('near_top');
      });

      slideshow.on('scrollernotneartop', function(event) {
        var page = $(event.target).parents('section');

        if (page.hasClass('active')) {
          that.element.removeClass('near_top');
        }
      });

      if (slideshow.currentPage()) {
        updateClasses(slideshow.currentPage());
      }

      this.element.find('.header input').placeholder();

      function updateClasses(page) {
        that.element.toggleClass('invert', page.hasClass('invert'));
        that.element.toggleClass('first_page', page.index() === 0);
        that.element.addClass('near_top');
      }
    }
  });
});