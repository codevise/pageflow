(function($) {
  $.widget('pageflow.topButton', {
    _create: function() {
      var element = this.element;

      element.click(function(event) {
        pageflow.slides.goToLandingPage();
        event.preventDefault();
      });

      pageflow.slides.on('pageactivate', function(e, ui) {
        toggle();
      });

      toggle(pageflow.slides.currentPage());

      function toggle() {
        var onLandingPage = pageflow.slides.isOnLandingPage();

        element.toggleClass('deactivated', onLandingPage);
        element.attr('tabindex', onLandingPage ? '-1' : '2');
      }
    }
  });
}(jQuery));