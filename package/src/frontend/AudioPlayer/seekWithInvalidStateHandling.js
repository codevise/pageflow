/**
 * Calling seek before the media tag is ready causes InvalidState
 * exeption. If this happens, we wait for the next progress event and
 * retry. We resolve a promise once seeking succeeded.
 *
 * @api private
 */
export const seekWithInvalidStateHandling = function(player) {
  var originalSeek = player.seek;

  player.seek = function(time) {
    return retryOnProgress(function() {
      originalSeek.call(player, time);
    });
  };

  function retryOnProgress(fn) {
    var tries = 0;

    return new Promise(function(resolve, reject) {
      function tryOrWaitForProgress() {
        tries += 1;

        if (tries >= 50) {
          reject();
          return;
        }

        try {
          fn();
          resolve();
        }
        catch(e) {
          player.one('progress', tryOrWaitForProgress);
        }
      }

      tryOrWaitForProgress();
    });
  }
};