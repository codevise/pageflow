(function($) {
  $.widget('pageflow.muteToggle', {
    _create: function() {
      var audio = new Audio();
      audio.setAttribute('src', '/assets/pageflow/unmute.mp3');

      var element = this.element;
      element.on('click', toggle);

      pageflow.events.on('background_media:unmute', this.update, this);
      this.update();

      function toggle() {
        if (pageflow.backgroundMedia.muted) {
          pageflow.backgroundMedia.unmute();
          audio.play();
        }
      }
    },

    update: function() {
      if (pageflow.backgroundMedia.muted) {
        this.element
          .attr('title', this.element.attr('data-muted-title'))
          .addClass('muted')
          .html('UNMUTE');
      }
      else {
        this.element.remove();
        this.destroy();
      }
    }
  });
}(jQuery));