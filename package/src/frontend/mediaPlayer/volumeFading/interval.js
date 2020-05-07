export const interval = function(player) {
  const originalVolume = player.volume;

  let fadeVolumeResolve;
  let fadeVolumeInterval;

  player.volume = function(value) {
    if (typeof value !== 'undefined') {
      cancelFadeVolume();
    }

    return originalVolume.apply(player, arguments);
  };

  player.fadeVolume = function(value, duration) {
    cancelFadeVolume();

    return new Promise(function(resolve, reject) {
      const resolution = 10;
      const startValue = volume();
      const steps = duration / resolution;
      const leap = (value - startValue) / steps;

      if (value === startValue) {
        resolve();
      }
      else {
        fadeVolumeResolve = resolve;
        fadeVolumeInterval = setInterval(function() {
          volume(volume() + leap);

          if ((volume() >= value && value >= startValue) ||
              (volume() <= value && value <= startValue)) {

            resolveFadeVolume();
          }
        }, resolution);
      }
    });
  };

  player.one('dispose', cancelFadeVolume);

  function volume(/* arguments */) {
    return originalVolume.apply(player, arguments);
  }

  function resolveFadeVolume() {
    clearInterval(fadeVolumeInterval);
    fadeVolumeResolve('done');

    fadeVolumeInterval = null;
    fadeVolumeResolve = null;
  }

  function cancelFadeVolume() {
    if (fadeVolumeResolve) {
      fadeVolumeResolve('cancelled');
      fadeVolumeResolve = null;
    }

    if (fadeVolumeInterval) {
      clearInterval(fadeVolumeInterval);
      fadeVolumeInterval = null;
    }
  }
};
