/**
 * Mute feature settings for background media (ATMO and background videos)
 *
 * @since edge
 */
pageflow.backgroundMedia = {
  muted: false,

  setup: function() {
    this.muted = pageflow.browser.has('only muted autoplay support');
  },

  unmute: function() {
    this.muted = false;
    Howler.mute(false);
    pageflow.events.trigger('background_media:unmute');
  }
};
