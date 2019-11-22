pageflow.mediaPlayer.useSlimPlayerControlsDuringPhonePlayback = function(player) {
  var originalPlay = player.play;

  player.play = function() {
    if (pageflow.browser.has('phone platform') &&
        !pageflow.browser.has('native video player')) {
      pageflow.widgets.use({
        name: 'slim_player_controls', insteadOf: 'classic_player_controls'
      }, function(restoreWidgets) {
        player.one('pause', restoreWidgets);
      });
    }

    return originalPlay.apply(this, arguments);
  };
};