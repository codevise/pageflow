import {browser} from '../browser';
import {state} from '../state';

export const useSlimPlayerControlsDuringPhonePlayback = function(player) {
  var originalPlay = player.play;

  player.play = function() {
    if (browser.has('phone platform') &&
        !browser.has('native video player')) {
      state.widgets.use({
        name: 'slim_player_controls', insteadOf: 'classic_player_controls'
      }, function(restoreWidgets) {
        player.one('pause', restoreWidgets);
      });
    }

    return originalPlay.apply(this, arguments);
  };
};