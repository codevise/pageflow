pageflow.AudioPlayer.volumeBinding = function(player, settings) {
  var originalPlay = player.play;
  var originalPause = player.pause;

  player.play = function() {
    player.volume(settings.get('volume'));
    listenToVolumeSetting();

    originalPlay.call(player);
  };

  player.playAndFadeIn = function(duration) {
    player.volume(0);
    listenToVolumeSetting();

    originalPlay.call(player);

    return player.fadeVolume(settings.get('volume'), duration);
  };

  player.pause = function() {
    stopListeningToVolumeSetting();
    originalPause.call(player);
  };

  player.fadeOutAndPause = function(duration) {
    stopListeningToVolumeSetting();

    return player.fadeVolume(0, duration).then(function() {
      originalPause.call(player);
    });
  };

  function listenToVolumeSetting() {
    settings.on('change:volume', onVolumeChange);
  }

  function stopListeningToVolumeSetting() {
    settings.off('change:volume', onVolumeChange);
  }

  function onVolumeChange(model, value) {
    player.fadeVolume(value, 40);
  }
};