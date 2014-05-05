(function($) {
  $.widget('pageflow.loadingSpinner', {
    _create: function() {
      var element = this.element;

      setTimeout(function() {
        pageflow.ready.then(function() {
          element.addClass('fade');

          setTimeout(function() {
            element.hide();
          }, 1000);
        });
      }, 1000);
    }
  });

  $(function() {
    $('.loading_spinner').loadingSpinner();
  });
}(jQuery));