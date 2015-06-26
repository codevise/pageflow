pageflow.mediaPlayer.volumeBinding = function(player, settings, options) {
  options = options || {};

  var originalPlay = player.play;
  var originalPause = player.pause;

  var volumeFactor = 'volumeFactor' in options ? options.volumeFactor : 1;

  player.play = function() {
    player.volume(player.targetVolume());
    listenToVolumeSetting();

    return originalPlay.call(player);
  };

  player.playAndFadeIn = function(duration) {
    if (!player.paused()) {
      return new jQuery.Deferred().resolve().promise();
    }

    player.volume(0);

    return $.when(originalPlay.call(player)).then(function() {
      listenToVolumeSetting();
      return player.fadeVolume(player.targetVolume(), duration);
    });
  };

  player.pause = function() {
    stopListeningToVolumeSetting();
    originalPause.call(player);
  };

  player.fadeOutAndPause = function(duration) {
    if (player.paused()) {
      return new jQuery.Deferred().resolve().promise();
    }

    stopListeningToVolumeSetting();

    return player.fadeVolume(0, duration).then(function() {
      originalPause.call(player);
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
    settings.on('change:volume', onVolumeChange);
  }

  function stopListeningToVolumeSetting() {
    settings.off('change:volume', onVolumeChange);
  }

  function onVolumeChange(model, value) {
    player.fadeVolume(player.targetVolume(), 40);
  }
};