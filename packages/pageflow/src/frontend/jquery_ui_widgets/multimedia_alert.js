(function($) {
  $.widget('pageflow.multimediaAlert', {
    _create: function() {
      var widget = this;

      function show() {
        widget.element.show();
        toggleContent(false);
      }

      function hide() {
        widget.element.hide();
        toggleContent(true);
      }

      function toggleContent(state) {
        $('.page .content').toggleClass('initially_hidden', !state);
        $('.slideshow .scroll_indicator').toggleClass('initially_hidden', !state);
      }

      pageflow.manualStart.required().then(function(start) {
        show();

        widget.element.find('.close').one('click', function() {
          hide();
          pageflow.backgroundMedia.unmute();

          pageflow.events.trigger('button:close_multimedia_alert');
          start();

          return false;
        });
      });

      pageflow.events.on('request:multimedia_alert', function() {
        show();

        widget.element.find('.close').one('click', function() {
          hide();
        });
      }, this);

      pageflow.nativeScrolling.preventScrollBouncing(this.element);
    }
  });
}(jQuery));
