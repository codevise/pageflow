pageflow.mediaPlayer.volumeFading = function(player) {
  var originalVolume = player.volume;
  var fadeVolumeDeferred;
  var fadeVolumeInterval;

  player.volume = function(value) {
    if (typeof value !== 'undefined') {
      cancelFadeVolume();
    }

    return originalVolume.apply(player, arguments);
  };

  player.fadeVolume = function(value, duration) {
    cancelFadeVolume();

    return new $.Deferred(function(deferred) {
      var resolution = 10;
      var startValue = volume();
      var steps = duration / resolution;
      var leap = (value - startValue) / steps;

      if (value === startValue) {
        deferred.resolve();
      }
      else {
        fadeVolumeDeferred = deferred;
        fadeVolumeInterval = setInterval(function() {
          volume(volume() + leap);

          if ((volume() >= value && value >= startValue) ||
              (volume() <= value && value <= startValue)) {

            resolveFadeVolume();
          }
        }, resolution);
      }
    });

    function volume(/* arguments */) {
      return originalVolume.apply(player, arguments);
    }
  };

  player.one('dispose', cancelFadeVolume);

  function resolveFadeVolume() {
    clearInterval(fadeVolumeInterval);
    fadeVolumeDeferred.resolve();

    fadeVolumeInterval = null;
    fadeVolumeDeferred = null;
  }

  function cancelFadeVolume() {
    if (fadeVolumeInterval) {
      clearInterval(fadeVolumeInterval);
      fadeVolumeDeferred.reject();

      fadeVolumeInterval = null;
      fadeVolumeDeferred = null;
    }
  }
};