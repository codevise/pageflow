pageflow.VideoPlayer.useHowlerForAudioOutput = function(player) {
  var fadeDeferred = $.Deferred();

  var playerAudio = new Howl({
    loop: player.options_.loop,
    src: player.currentSources().map(function(source){
      return source.src;
    })
  });

  var originalPlay = player.play;
  player.play = function() {
    // Maintains video and audio sync when starting playback
    var videoCurrentTime = this.currentTime();
    playerAudio.seek(videoCurrentTime);

    playerAudio.play();
    return originalPlay.apply(this, arguments);
  };

  var originalPause = player.pause;
  player.pause = function() {
    playerAudio.pause();
    return originalPause.apply(this, arguments);
  };

  player.fadeVolume = function(newVolume, duration) {
    var currentVolume = playerAudio.volume();
    playerAudio.fade(currentVolume, newVolume, duration);
    return new fadeDeferred.promise();
  };

  playerAudio.on('fade', function() {
    fadeDeferred.resolve();
  });
};
