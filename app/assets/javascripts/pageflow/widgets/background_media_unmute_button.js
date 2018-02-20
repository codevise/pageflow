(function($) {
  $.widget('pageflow.backgroundMediaUnmuteButton', {
    _create: function() {
      this.element.on('click', function toggle() {
        var audio = new Howl({
          src: [pageflow.assetUrls.unmuteSound]
        });

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