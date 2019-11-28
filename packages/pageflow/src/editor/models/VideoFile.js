import {EncodedFile} from './EncodedFile';

export const VideoFile = EncodedFile.extend({
  getBackgroundPositioningImageUrl: function() {
    return this.get('poster_url');
  },

  isPositionable: function() {
    return this.isReady();
  }
});
