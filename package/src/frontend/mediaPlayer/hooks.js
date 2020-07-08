export const hooks = function(player, hooks) {
  var originalPlay = player.play;

  player.updateHooks = (newHooks) => {
    hooks = newHooks;
  }
  
  player.play = function(/* args */) {
    var args = arguments;

    player.trigger('beforeplay');
    player.intendToPlay();

    if (hooks.before) {
      return Promise.all([hooks.before()]).then(function() {
        return player.ifIntendingToPlay().then(function() {
          return originalPlay.apply(player, args);
        });
      });
    }
    else{
      return originalPlay.apply(player, args);
    }
  };

  if (player.afterHookListener) {
    player.off('pause', player.afterHookListener);
    player.off('ended', player.afterHookListener);
  }

  player.afterHookListener = ()=>{
    if (hooks.after) {
      hooks.after();
    }
  }
  player.on('pause', player.afterHookListener);
  player.on('ended', player.afterHookListener);

};
