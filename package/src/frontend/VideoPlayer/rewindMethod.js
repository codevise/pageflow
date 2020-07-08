export const rewindMethod = function(player) {
  /**
   * Seek to beginning of file. If already at the beginning do
   * nothing.
   *
   * @alias pageflow.VideoPlayer#rewind
   */
  player.rewind = function() {
    if (player.currentTime() > 0) {
      player.currentTime(0);

      player.trigger('timeupdate', player.currentTime(), player.duration());
      return Promise.resolve();
    }
    else {
      return Promise.resolve();
    }
  };
};
