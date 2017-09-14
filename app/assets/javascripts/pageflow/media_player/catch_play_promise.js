/*global Promise*/

// Chrome returns a promise from `play` that is rejected if another
// operation (like calling `pause` or updating the source) happens
// before playing started. If the promise rejection is not handled,
// the operation that caused `play` to abort will fail with an
// exception. Code following the operation will not be executed. Catch
// and ignore the promise to prevent this.
pageflow.mediaPlayer.catchPlayerPromise = function(player) {
  var originalPlay = player.play;

  player.play = function(/* arguments */) {
    var result = originalPlay.apply(player, arguments);

    if (result && (typeof Promise !== 'undefined') && (result instanceof Promise)) {
      result.catch(function() {
        pageflow.log('Caught pending play exception - continuing');
      });
    }

    return result;
  };
};