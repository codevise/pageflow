import {events} from 'pageflow/frontend';

/**
 * Mute feature settings for background media (ATMO and background videos)
 *
 * @since 13.0
 */
export const backgroundMedia = {
  muted: false,

  unmute: function() {
    if (this.muted) {
      this.muted = false;
      events.trigger('background_media:unmute');
    }
  },

  mute: function() {
    if (!this.muted) {
      this.muted = true;
      events.trigger('background_media:mute');
    }
  }
};
