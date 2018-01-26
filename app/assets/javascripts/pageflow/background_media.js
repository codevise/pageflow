/**
 *  Mute feature settings for background media (ATMO and background videos)
 *
 * @since edge
 */

pageflow.backgroundMedia = {
  muted: false,

  setup: function() {
    if (pageflow.browser.has('mobile platform')) {
      this.muted = true;
      Howler.mute(true);
    }
  },

  unmute: function() {
    this.muted = false;
    pageflow.atmo.enable();
    Howler.mute(false);
    pageflow.events.trigger('background_media:unmute');
  }
};