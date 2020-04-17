import {log} from '../base';

export const handleFailedPlay = function(player, options) {
  var originalPlay = player.play;

  player.play = function(/* arguments */) {
    var result = originalPlay.apply(player, arguments);

    if (result && typeof result.catch !== 'undefined') {
      return result.catch(function(e) {
        if (e.name === 'NotAllowedError' && options.hasAutoplaySupport) {
          if (options.fallbackToMutedAutoplay) {
            player.muted(true);

            return originalPlay.apply(player, arguments).then(
              function() {
                player.trigger('playmuted');
              },
              function() {
                player.trigger('playfailed');
              }
            );
          }
          else {
            player.trigger('playfailed');
          }
        }
        else {
          log('Caught play exception for video.');
        }
      });
    }

    return result;
  };
};
