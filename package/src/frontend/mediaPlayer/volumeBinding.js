export const volumeBinding = function(player, settings, options) {
  options = options || {};

  var originalPlay = player.play;
  var originalPause = player.pause;

  var volumeFactor = 'volumeFactor' in options ? options.volumeFactor : 1;

  player.play = function() {
    player.intendToPlay();
    player.volume(player.targetVolume());
    listenToVolumeSetting();

    return originalPlay.call(player);
  };

  player.playAndFadeIn = function(duration) {
    if (!player.paused() && !player.intendingToPause()) {
      return Promise.resolve();
    }

    player.intendToPlay();
    player.volume(0);

    return Promise.all([originalPlay.call(player)]).then(function() {
      listenToVolumeSetting();
      return player.ifIntendingToPlay().then(function() {
        return player.fadeVolume(player.targetVolume(), duration).then(null, function() {
          return Promise.resolve();
        });
      });
    });
  };

  player.pause = function() {
    stopListeningToVolumeSetting();
    originalPause.call(player);
  };

  player.fadeOutAndPause = function(duration) {
    if (player.paused() && !player.intendingToPlay()) {
      return Promise.resolve();
    }

    player.intendToPause();
    stopListeningToVolumeSetting();

    return player.fadeVolume(0, duration).then(function() {
      return player.ifIntendingToPause().then(function() {
        originalPause.call(player);
      });
    });
  };

  player.changeVolumeFactor = function(factor, duration) {
    volumeFactor = factor;
    return player.fadeVolume(player.targetVolume(), duration);
  };

  player.targetVolume = function() {
    return settings.get('volume') * volumeFactor;
  };

  function listenToVolumeSetting() {
    player.on('dispose', stopListeningToVolumeSetting);
    settings.on('change:volume', onVolumeChange);
  }

  function stopListeningToVolumeSetting() {
    player.off('dispose', stopListeningToVolumeSetting);
    settings.off('change:volume', onVolumeChange);
  }

  function onVolumeChange(model, value) {
    player.fadeVolume(player.targetVolume(), 40);
  }
};
