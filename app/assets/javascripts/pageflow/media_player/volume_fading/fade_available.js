pageflow.mediaPlayer.volumeFading.fadeAvailable = function(player) {
  player.fadeVolume = function(value, duration) {
    var currentValue = this.volume();

    this.fade(currentValue, value, duration);

    return new $.Deferred().resolve().promise();
  };
};
