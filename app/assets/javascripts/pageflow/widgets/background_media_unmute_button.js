(function($) {
  $.widget('pageflow.backgroundMediaUnmuteButton', {
    _create: function() {
      var audio = new Audio();
      audio.setAttribute('src', pageflow.assetUrls.unmuteSound);

      this.element.on('click', function toggle() {
        pageflow.backgroundMedia.unmute();
        audio.play();
      });

      pageflow.events.once('background_media:unmute', this.update, this);
      this.update();
    },

    update: function() {
      if (!pageflow.backgroundMedia.muted) {
        this.element.remove();
        this.destroy();
      }
    }
  });
}(jQuery));