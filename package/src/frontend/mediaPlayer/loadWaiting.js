export const loadWaiting = function(player) {
  var originalFadeVolume = player.fadeVolume;

  player.fadeVolume = function(/* args */) {
    var args = arguments;

    return Promise.all([this.loadedPromise]).then(function() {
      return originalFadeVolume.apply(player, args);
    });
  };
};