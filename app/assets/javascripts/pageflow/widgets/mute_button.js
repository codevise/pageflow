(function($) {
  $.widget('pageflow.muteButton', {
    _create: function() {
      var element = this.element;
      var volumeBeforeMute = 1;

      element.on('click', toggleMute);

      pageflow.settings.on('change:volume', this.update, this);
      this.update();

      function toggleMute() {
        if (pageflow.settings.get('volume') > 0) {
          volumeBeforeMute = pageflow.settings.get('volume');
          pageflow.settings.set('volume', 0);
        }
        else {
          pageflow.settings.set('volume', volumeBeforeMute);
        }
      }
    },

    _destroy: function() {
      pageflow.settings.off('change:volume', this.update);
    },

    update: function() {
      var volume = pageflow.settings.get('volume');

      if (volume === 0) {
        this.element
          .attr('title', this.element.attr('data-muted-title'))
          .addClass('muted');
      }
      else {
        this.element
          .attr('title', this.element.attr('data-not-muted-title'))
          .removeClass('muted');
      }
    }
  });
}(jQuery));