import {log} from '../base';
import {browser} from '../browser';

export const bufferUnderrunWaiting = function(player) {
  var originalPause = player.pause;

  player.pause = function() {
    cancelWaiting();
    originalPause.apply(this, arguments);
  };

  function pauseAndPreloadOnUnderrun() {
    if (bufferUnderrun()) {
      pauseAndPreload();
    }
  }

  function bufferUnderrun() {
    return !player.isBufferedAhead(0.1, true) && !player.waitingOnUnderrun && !ignoringUnderruns();
  }

  function pauseAndPreload() {
    log('Buffer underrun');

    player.trigger('bufferunderrun');
    player.pause();

    player.waitingOnUnderrun = true;

    player.prebuffer({secondsToBuffer: 5, secondsToWait: 5}).then(function() {
      // do nothing if user aborted waiting by clicking pause
      if (player.waitingOnUnderrun) {
        player.waitingOnUnderrun = false;
        player.trigger('bufferunderruncontinue');

        player.play();
      }
    }, () => {});
  }

  function cancelWaiting() {
    if (player.waitingOnUnderrun) {
      player.ignoreUnderrunsUntil = new Date().getTime() + 5 * 1000;
      player.waitingOnUnderrun = false;

      player.trigger('bufferunderruncontinue');
    }
  }

  function ignoringUnderruns() {
    var r = player.ignoreUnderrunsUntil && new Date().getTime() < player.ignoreUnderrunsUntil;

    if (r) {
      log('ignoring underrun');
    }

    return r;
  }

  function stopListeningForProgress() {
    player.off('progress', pauseAndPreloadOnUnderrun);
  }

  if (browser.has('buffer underrun waiting support')) {
    player.on('play', function() {
      player.on('progress', pauseAndPreloadOnUnderrun);
    });

    player.on('pause', stopListeningForProgress);
    player.on('ended', stopListeningForProgress);
  }
};
