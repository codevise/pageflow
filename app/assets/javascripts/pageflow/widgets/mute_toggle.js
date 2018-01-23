(function($) {
  $.widget('pageflow.muteToggle', {
    _create: function() {
      var audio = new Audio();
      audio.setAttribute('src', '/assets/pageflow/unmute.mp3');

      var element = this.element;
      var volumeBeforeMute = 1;

      if (!pageflow.browser.has('autoplay support')) {
        pageflow.settings.set('volume', 0);
      }

      element.on('click', toggleMute);

      pageflow.settings.on('change:volume', this.update, this);
      this.update();

      function toggleMute() {
        if (pageflow.settings.get('volume') > 0) {
          volumeBeforeMute = pageflow.settings.get('volume');
          pageflow.settings.set('volume', 0);
        }
        else {
          audio.play();
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
          .addClass('muted')
          .html('UNMUTE - v:'+volume);
      }
      else {
        this.element
          .attr('title', this.element.attr('data-not-muted-title'))
          .removeClass('muted')
          .html('MUTE - v:'+volume);
      }
    }
  });
}(jQuery));