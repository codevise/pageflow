pageflow.VideoPlayer.mutedAutoplaySound = function(player) {
  if (pageflow.browser.has('mobile platform')) {
    function setupHowler() {
      if (!player.howler) {
        var videoSrc = player.currentSources().find(function(i){
          return i.type === 'video/mp4';
        }).src;

        player.howler = new Howl({
          src: [ videoSrc ],
          loop: true
        });
      }
    }

    player.ready(function() {
      setupHowler();
    });

    var originalPlay = player.play;
    player.play = function() {
      setupHowler();
      player.howler.play();
      return originalPlay.apply(this, arguments);
    };

    var originalPause = player.pause;
    player.pause = function() {
      setupHowler();
      player.howler.pause();
      return originalPause.apply(this, arguments);
    };
  }
};
