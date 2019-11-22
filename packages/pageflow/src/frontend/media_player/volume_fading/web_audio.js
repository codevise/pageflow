pageflow.mediaPlayer.volumeFading.webAudio = function(player, audioContext) {
  var gainNode;

  var currentDeferred;
  var currentTimeout;

  var currentValue = 1;

  var lastStartTime;
  var lastDuration;
  var lastStartValue;

  var allowedMinValue = 0.000001;

  if (audioContext.state === 'suspended') {
    pageflow.events.on('background_media:unmute', function() {
      player.volume(currentValue);
    });
  }

  function tryResumeIfSuspended() {
    return new $.Deferred(function(deferred) {
      if (audioContext.state === 'suspended') {
        var maybePromise = audioContext.resume();

        if (maybePromise && maybePromise.then) {
          maybePromise.then(handleDeferred);
        }
        else {
          setTimeout(handleDeferred, 0);
        }
      }
      else {
        deferred.resolve();
      }

      function handleDeferred() {
        if (audioContext.state === 'suspended') {
          deferred.reject();
        }
        else {
          deferred.resolve();
        }
      }
    }).promise();
  }

  player.volume = function(value) {
    if (typeof value !== 'undefined') {
      tryResumeIfSuspended().then(
        function() {
          ensureGainNode();

          cancel();
          currentValue = ensureInAllowedRange(value);

          gainNode.gain.setValueAtTime(currentValue,
                                       audioContext.currentTime);
        },
        function() {
          currentValue = ensureInAllowedRange(value);
        }
      );
    }

    return Math.round(currentValue * 100) / 100;
  };

  player.fadeVolume = function(value, duration) {
    return tryResumeIfSuspended().then(
      function() {
        ensureGainNode();

        cancel();
        recordFadeStart(duration);

        currentValue = ensureInAllowedRange(value);

        gainNode.gain.setValueAtTime(lastStartValue, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(currentValue,
                                              audioContext.currentTime + duration / 1000);

        return new $.Deferred(function(deferred) {
          currentTimeout = setTimeout(resolve, duration);
          currentDeferred = deferred;
        }).promise();
      },
      function() {
        currentValue = ensureInAllowedRange(value);
        return new $.Deferred().resolve().promise();
      }
    );
  };

  player.one('dispose', cancel);

  function ensureGainNode() {
    if (!gainNode) {
      gainNode = audioContext.createGain();

      var source = audioContext.createMediaElementSource(player.getMediaElement());

      source.connect(gainNode);
      gainNode.connect(audioContext.destination);
    }
  }

  function resolve() {
    clearTimeout(currentTimeout);
    currentDeferred.resolve();

    currentTimeout = null;
    currentDeferred = null;
  }

  function cancel() {
    if (currentDeferred) {
      gainNode.gain.cancelScheduledValues(audioContext.currentTime);

      clearTimeout(currentTimeout);
      currentDeferred.reject();

      currentTimeout = null;
      currentDeferred = null;

      updateCurrentValueFromComputedValue();
    }
  }

  function recordFadeStart(duration) {
    lastStartTime = audioContext.currentTime;
    lastStartValue = currentValue;
    lastDuration = duration;
  }

  function updateCurrentValueFromComputedValue() {
    // Firefox 54 on Ubuntu does not provide computed values when gain
    // was changed via one of the scheduling methods. Instead
    // gain.value always reports 1. Interpolate manually do determine
    // how far the fade was performed before cancel was called.
    if (gainNode.gain.value == 1) {
      var performedDuration = (audioContext.currentTime - lastStartTime) * 1000;
      var lastDelta = currentValue - lastStartValue;
      var performedFraction = lastDelta > 0 ? performedDuration / lastDuration : 1;

      currentValue = ensureInAllowedRange(
        lastStartValue + performedFraction * lastDelta
      );
    }
    else {
      currentValue = gainNode.gain.value;
    }
  }

  function ensureInAllowedRange(value) {
    return value < allowedMinValue ? allowedMinValue : value;
  }
};
