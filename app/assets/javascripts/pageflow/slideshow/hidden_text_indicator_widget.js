(function($) {
  $.widget('pageflow.hiddenTextIndicator', {
    _create: function() {
      var parent = this.options.parent,
          that = this;

      parent.on('pageactivate', function(event) {
        that.element.toggleClass('invert', $(event.target).hasClass('invert'));
        that.element.toggleClass('hidden',
                                 $(event.target).hasClass('hide_content_with_text') ||
                                 $(event.target).hasClass('no_hidden_text_indicator'));
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
