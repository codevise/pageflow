pageflow.mediaPlayer.hooks = function(player, hooks) {
  var originalPlay = player.play;
  var originalPlayAndFadeIn = player.play;

  if (hooks.before) {
    player.play = function(/* args */) {
      var args = arguments;

      player.trigger('beforeplay');
      player.intendToPlay();

      return $.when(hooks.before()).then(function() {
        return player.ifIntendingToPlay().then(function() {
          return originalPlay.apply(player, args);
        });
      });
    };
  }

  if (hooks.after) {
    player.on('pause', hooks.after);
    player.on('ended', hooks.after);
  }
};