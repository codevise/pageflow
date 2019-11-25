import jQuery from 'jquery';

(function($) {
  $.widget('pageflow.hiddenTextIndicator', {
    _create: function() {
      var parent = this.options.parent,
          that = this;

      parent.on('pageactivate', function(event) {
        var pageOrPageWrapper = $(event.target).add('.content_and_background', event.target);

        that.element.toggleClass('invert', $(event.target).hasClass('invert'));
        that.element.toggleClass('hidden',
                                 pageOrPageWrapper.hasClass('hide_content_with_text') ||
                                 pageOrPageWrapper.hasClass('no_hidden_text_indicator'));
      });

      parent.on('hidetextactivate', function() {
        that.element.addClass('visible');
      });

      parent.on('hidetextdeactivate', function() {
        that.element.removeClass('visible');
      });
    }
  });
}(jQuery));
