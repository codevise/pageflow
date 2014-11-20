pageflow.VideoFile = pageflow.EncodedFile.extend({
  getBackgroundPositioningImageUrl: function() {
    return this.get('poster_url');
  },

  isPositionable: function() {
    return this.isReady();
  }
});
