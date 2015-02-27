pageflow.AudioPlayer.volumeFading = function(player) {
  player.fadeVolume = function(value, duration) {
    return new $.Deferred(function(deferred) {
      var resolution = 10;
      var startValue = player.volume();
      var steps = duration / resolution;
      var leap = (value - startValue) / steps;

      clearInterval(player.fadeVolumeInterval);

      if (value !== startValue) {
        var interval = player.fadeVolumeInterval = setInterval(function() {
          player.volume(player.volume() + leap);

          if ((player.volume() >= value && value >= startValue) ||
              (player.volume() <= value && value <= startValue)) {

            clearInterval(interval);
            deferred.resolve();
          }
        }, resolution);
      }
    }).promise();
  };
};