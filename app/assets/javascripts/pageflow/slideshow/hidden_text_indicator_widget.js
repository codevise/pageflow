(function($) {
  $.widget('pageflow.hiddenTextIndicator', {
    _create: function() {
      var parent = this.options.parent,
          that = this;

      parent.on('pageactivate', function(event) {
        that.element.toggleClass('invert', $(event.target).hasClass('invert'));
        that.element.toggleClass('hidden', $(event.target).hasClass('hide_content_with_text'));
      });

      parent.on('hidetextactivate', function(event) {
        that.element.addClass('visible');
      });

      parent.on('hidetextdeactivate', function() {
        that.element.removeClass('visible');
      });
    }
  });
}(jQuery));