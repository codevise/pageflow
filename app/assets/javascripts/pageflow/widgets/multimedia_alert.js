(function($) {
  $.widget('pageflow.multimediaAlert', {
    _create: function() {
      var widget = this;

      function toggleContent(state) {
        $('.page .content').toggleClass('initially_hidden', !state);
        $('.slideshow .scroll_indicator').toggleClass('initially_hidden', !state);
      }

      pageflow.manualStart.required().then(function(start) {
        widget.element.show();
        toggleContent(false);

        widget.element.find('.close').on('click', function() {
          widget.element.hide();
          toggleContent(true);
          start();
          return false;
        });
      });
    }
  });
}(jQuery));