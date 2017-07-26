pageflow.mediaPlayer.volumeFading.noop = function(player) {
  player.fadeVolume = function(value, duration) {
    return new jQuery.Deferred().resolve().promise();
  };
};
