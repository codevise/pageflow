pageflow.AudioPlayer.rewindMethod = function(player) {
  /**
   * Seek to beginning of file. If already at the beginning do
   * nothing.
   */
  player.rewind = function() {
    if (player.position > 0) {
      var result = player.seek(0);

      player.trigger('timeupdate', player.position, player.duration);
      return result;
    }
    else {
      return new $.Deferred().resolve().promise();
    }
  };
};