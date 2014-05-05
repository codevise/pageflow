(function($) {
  $.widget('pageflow.homeButton', {
    _create: function() {
      var element = this.element;

      element.click(function(event) {
        pageflow.slides.goToById(element.data('link'));
        event.preventDefault();
      });

      pageflow.slides.on('pageactivate', function(e, ui) {
        toggle($(e.target));
      });

      toggle(pageflow.slides.currentPage());

      function toggle(currentPage) {
        var currentPageId = currentPage.data('id');
        var onHomePage = (currentPageId === element.data('link'));

        element.toggleClass('deactivated', onHomePage);
        element.attr('tabindex', onHomePage ? '-1' : '2');
      }
    }
  });
}(jQuery));