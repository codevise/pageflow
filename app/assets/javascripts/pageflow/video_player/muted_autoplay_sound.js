pageflow.VideoPlayer.mutedAutoplaySound = function(player) {
  if (!pageflow.browser.has('native video player')) {
    var originalReady = player.ready;
    player.ready = function() {
      var videoSrc = player.currentSources().find(function(i){
        return i.type === 'video/mp4';
      }).src;

      player.howler = new Howl({
        src: [ videoSrc ],
        loop: true
      });
      return originalReady.apply(this, arguments);
    };

    var originalPlay = player.play;
    player.play = function() {
      player.howler.play();
      return originalPlay.apply(this, arguments);
    };

    var originalPause = player.pause;
    player.pause = function() {
      player.howler.pause();
      return originalPause.apply(this, arguments);
    };

    var originalEnded = player.ended;
    player.ended = function() {
      player.howler.pause();
      return originalEnded.apply(this, arguments);
    };
  }
};
