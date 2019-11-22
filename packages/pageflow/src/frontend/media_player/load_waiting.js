pageflow.mediaPlayer.loadWaiting = function(player) {
  var originalFadeVolume = player.fadeVolume;

  player.fadeVolume = function(/* args */) {
    var args = arguments;

    return jQuery.when(this.loadedPromise).then(function() {
      return originalFadeVolume.apply(player, args);
    });
  };
};