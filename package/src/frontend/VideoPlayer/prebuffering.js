import {browser} from '../browser';
import {log} from '../base';

export const prebuffering = function(player) {
  let prebufferPromiseReject;

  player.isBufferedAhead = function(delta, silent) {
    // video.js only gives us one time range starting from 0 here. We
    // still ask for the last time range to be on the safe side.
    var timeRanges = player.buffered();
    var currentBufferTime = timeRanges.end(timeRanges.length - 1);
    var desiredBufferTime = player.currentTime() + delta;

    if (player.duration()) {
      desiredBufferTime = Math.min(desiredBufferTime, Math.floor(player.duration()));
    }

    var result = currentBufferTime >= desiredBufferTime;

    if (!silent) {
      log('buffered ahead ' + delta + ': ' + result + ' (' + currentBufferTime + '/' + desiredBufferTime + ')');
    }

    return result;
  };

  player.prebuffer = function(options) {
    options = options || {};

    const delta = options.secondsToBuffer || 10;
    const secondsToWait = options.secondsToWait || 3;
    const interval = 200;
    const maxCount = secondsToWait * 1000 / interval;
    let count = 0;
    let timeout;

    let promiseResolve;
    const promise = new Promise((resolve, reject) => {
      promiseResolve = resolve;
      prebufferPromiseReject = reject;
    });

    if (browser.has('prebuffering support')) {
      if (!player.isBufferedAhead(delta) && !player.prebufferPromise) {
        log('prebuffering video ' + player.src());

        timeout = function() {
          setTimeout(function() {
            if (!player.prebufferPromise) {
              return;
            }

            count++;

            if (player.isBufferedAhead(delta) || count > maxCount) {
              log('finished prebuffering video ' + player.src());
              promiseResolve();
              player.prebufferPromise = null;
            }
            else {
              timeout();
            }
          }, interval);
        };

        timeout();
        player.prebufferPromise = promise;
      }
    }

    return player.prebufferPromise ? player.prebufferPromise : promise;
  };

  player.abortPrebuffering = function() {
    if (player.prebufferPromise) {
      log('ABORT prebuffering');

      prebufferPromiseReject('prebuffering aborted');
      player.prebufferPromise = null;
    }
  };

  var originalPause = player.pause;

  player.pause = function() {
    player.abortPrebuffering();
    return originalPause.apply(this, arguments);
  };

  player.one('dispose', function() {
    player.abortPrebuffering();
  });
};
