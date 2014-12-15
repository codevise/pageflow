pageflow.AudioPlayer.mediaEvents = function(player) {
  function triggerMediaEvent(name) {
    pageflow.events.trigger('media:' + name, {
      fileName: player.currentSrc,
      currentTime: player.position,
      duration: player.duration,
      volume: player.volume(),
      bitrate: 128000
    });
  }

  player.on('play', function() {
    triggerMediaEvent('play');
  });

  player.on('timeupdate', function() {
    triggerMediaEvent('timeupdate');
  });

  player.on('pause', function() {
    triggerMediaEvent('pause');
  });

  player.on('ended', function() {
    triggerMediaEvent('ended');
  });
};