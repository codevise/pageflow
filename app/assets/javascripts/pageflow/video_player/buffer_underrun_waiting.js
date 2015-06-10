pageflow.VideoPlayer.bufferUnderrunWaiting = function(player) {
  function pauseAndPreloadOnUnderrun() {
    if (bufferUnderrun()) {
      pauseAndPreload();
    }
  }

  function bufferUnderrun() {
    return !player.isBufferedAhead(0.1, true) && !player.waitingOnUnderrun && !ignoringUnderruns();
  }

  function pauseAndPreload() {
    pageflow.log('Buffer underrun');

    player.trigger('bufferunderrun');
    player.waitingOnUnderrun = true;

    player.pause();
    player.prebuffer({secondsToBuffer: 5, secondsToWait: 5}).then(function() {
      // do nothing if user aborted waiting by clicking play
      if (player.waitingOnUnderrun) {
        player.waitingOnUnderrun = false;
        player.trigger('bufferunderruncontinue');

        player.play();
      }
    });

    player.on('play', onNextPlay);

    function onNextPlay() {
      player.off('play', onNextPlay);

      // if user presses play button, ignore buffer underruns for a
      // moment to give the user the possibility to pause the video.
      if (player.waitingOnUnderrun) {
        player.ignoreUnderrunsUntil = new Date().getTime() + 5 * 1000;
        player.waitingOnUnderrun = false;
      }

      player.trigger('bufferunderruncontinue');
    }
  }

  function ignoringUnderruns() {
    var r = player.ignoreUnderrunsUntil && new Date().getTime() < player.ignoreUnderrunsUntil;

    if (r) {
      pageflow.log('ignoring underrun');
    }

    return r;
  }

  function stopListeningForProgress() {
    player.off('progress', pauseAndPreloadOnUnderrun);
  }

  if (pageflow.browser.has('buffer underrun waiting support')) {
    player.on('play', function() {
      player.on('progress', pauseAndPreloadOnUnderrun);
    });

    player.on('pause', stopListeningForProgress);
    player.on('ended', stopListeningForProgress);
  }
};