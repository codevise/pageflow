(function($) {
  $.widget('pageflow.topButton', {
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
        var onFirstPage = (currentPageId === element.data('link'));

        element.toggleClass('deactivated', onFirstPage);
        element.attr('tabindex', onFirstPage ? '-1' : '2');
      }
    }
  });
}(jQuery));