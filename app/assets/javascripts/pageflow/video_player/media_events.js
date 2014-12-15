pageflow.VideoPlayer.mediaEvents = function(player) {
  function triggerMediaEvent(name) {
    pageflow.events.trigger('media:' + name, {
      fileName: player.currentSrc(),
      currentTime: player.currentTime(),
      duration: player.duration(),
      volume: player.volume(),
      bitrate: pageflow.features.has('high bandwidth') ? 3500000 : 2000000
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