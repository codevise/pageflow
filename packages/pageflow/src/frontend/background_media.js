/**
 * Mute feature settings for background media (ATMO and background videos)
 *
 * @since 13.0
 */
pageflow.backgroundMedia = {
  muted: false,

  unmute: function() {
    if (this.muted) {
      this.muted = false;
      pageflow.events.trigger('background_media:unmute');
    }
  },

  mute: function() {
    if (!this.muted) {
      this.muted = true;
      pageflow.events.trigger('background_media:mute');
    }
  }
};
