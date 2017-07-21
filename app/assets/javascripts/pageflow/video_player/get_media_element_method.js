pageflow.VideoPlayer.getMediaElementMethod = function(player) {
  player.getMediaElement = function() {
    return player.tech({IWillNotUseThisInPlugins: true}).el();
  };
};
