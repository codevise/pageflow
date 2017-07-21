pageflow.mediaPlayer.volumeFading.webAudio = function(player, audioContext) {
  var gainNode;

  var currentDeferred;
  var currentTimeout;

  var currentValue = 1;

  var lastStartTime;
  var lastDuration;
  var lastStartValue;

  var allowedMinValue = 0.000001;

  player.volume = function(value) {
    ensureGainNode();

    if (typeof value !== 'undefined') {
      cancel();
      currentValue = ensureInAllowedRange(value);

      return gainNode.gain.setValueAtTime(currentValue,
                                          audioContext.currentTime);
    }

    return Math.round(currentValue * 100) / 100;
  };

  player.fadeVolume = function(value, duration) {
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

      currentValue = ensureInAllowedRange(
        lastStartValue + (performedDuration / lastDuration * lastDelta)
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