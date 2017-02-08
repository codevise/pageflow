pageflow.VideoPlayer.prebuffering = function(player) {
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
      pageflow.log('buffered ahead ' + delta + ': ' + result + ' (' + currentBufferTime + '/' + desiredBufferTime + ')');
    }

    return result;
  };

  player.prebuffer = function(options) {
    options = options || {};

    var delta = options.secondsToBuffer || 10;
    var secondsToWait = options.secondsToWait || 3;
    var interval = 200;
    var maxCount = secondsToWait * 1000 / interval;
    var count = 0;
    var deferred = $.Deferred();
    var timeout;

    if (pageflow.browser.has('prebuffering support')) {
      if (!player.isBufferedAhead(delta) && !player.prebufferDeferred) {
        pageflow.log('prebuffering video ' + player.srcFromOptions());

        timeout = function() {
          setTimeout(function() {
            if (!player.prebufferDeferred) {
              return;
            }

            count++;

            if (player.isBufferedAhead(delta) || count > maxCount) {
              pageflow.log('finished prebuffering video ' + player.srcFromOptions());
              deferred.resolve();
              player.prebufferDeferred = null;
            }
            else {
              timeout();
            }
          }, interval);
        };

        timeout();
        player.prebufferDeferred = deferred;
      }
    }

    return player.prebufferDeferred ? player.prebufferDeferred.promise() : deferred.resolve().promise();
  };

  player.abortPrebuffering = function() {
    if (player.prebufferDeferred) {
      pageflow.log('ABORT prebuffering');

      player.prebufferDeferred.reject();
      player.prebufferDeferred = null;
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