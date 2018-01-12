pageflow.mediaPlayer.volumeFading.howlerFading = function(player) {
  player.fadeVolume = function(value, duration) {
    var currentValue = this.volume();

    this.fade(currentValue, value, duration);

    return new $.Deferred().resolve().promise();
  };
};
