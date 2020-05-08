export const asyncPlay = function(player) {
  var originalPlay = player.play;
  var originalPause = player.pause;

  var intendingToPlay = false;
  var intendingToPause = false;

  player.play = function(/* arguments */) {
    player.intendToPlay();
    return originalPlay.apply(player, arguments);
  };

  player.pause = function(/* arguments */) {
    player.intendToPause();
    return originalPause.apply(player, arguments);
  };

  player.intendToPlay = function() {
    intendingToPlay = true;
    intendingToPause = false;
  };

  player.intendToPause = function() {
    intendingToPause = true;
    intendingToPlay = false;
  };

  player.intendingToPlay = function() {
    return intendingToPlay;
  };

  player.intendingToPause = function() {
    return intendingToPause;
  };

  player.ifIntendingToPause = function() {
    return promiseFromBoolean(intendingToPause);
  };

  player.ifIntendingToPlay = function() {
    return promiseFromBoolean(intendingToPlay);
  };

  function promiseFromBoolean(value) {
    return new Promise(function(resolve, reject) {
      if (value) {
        resolve();
      }
      else {
        reject('aborted');
      }
    });
  }
};