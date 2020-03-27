import jQuery from 'jquery';

jQuery(function($) {
  $.widget('pageflow.header', {
    _create: function() {
      var slideshow = this.options.slideshow,
          that = this;

      slideshow.on('pageactivate', function(event, options) {
        updateClasses(slideshow.currentPage(), options);
      });

      slideshow.on('scrollerneartop', function(event) {
        var page = $(event.target).parents('section');

        if (page.is(slideshow.currentPage())) {
          that.element.addClass('near_top');
        }
      });

      slideshow.on('scrollernotneartop', function(event) {
        var page = $(event.target).parents('section');

        if (page.is(slideshow.currentPage())) {
          that.element.removeClass('near_top');
        }
      });

      if (slideshow.currentPage().length) {
        updateClasses(slideshow.currentPage(), {});
      }

      this.element.addClass('near_top');
      this.element.find('.header input').placeholder();

      function updateClasses(page) {
        that.element.toggleClass('invert', page.hasClass('invert'));
        that.element.toggleClass('first_page', page.index() === 0);
        that.element.toggleClass('hide_logo', page.hasClass('hide_logo'));
      }
    }
  });
});
