/**
 * Calling seek before the media tag is ready causes InvalidState
 * exeption. If this happens, we wait for the next progress event and
 * retry. We resolve a promise once seeking succeeded.
 *
 * @api private
 */
pageflow.AudioPlayer.seekWithInvalidStateHandling = function(player) {
  var originalSeek = player.seek;

  player.seek = function(time) {
    return retryOnProgress(function() {
      originalSeek.call(player, time);
    });
  };

  function retryOnProgress(fn) {
    var tries = 0;

    return new $.Deferred(function(deferred) {
      function tryOrWaitForProgress() {
        tries += 1;

        if (tries >= 50) {
          deferred.reject();
          return;
        }

        try {
          fn();
          deferred.resolve();
        }
        catch(e) {
          player.one('progress', tryOrWaitForProgress);
        }
      }

      tryOrWaitForProgress();
    }).promise();
  }
};