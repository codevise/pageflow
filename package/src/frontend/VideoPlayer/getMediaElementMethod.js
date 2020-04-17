export const getMediaElementMethod = function(player) {
  player.getMediaElement = function() {
    var tech = player.tech({IWillNotUseThisInPlugins: true});
    return tech && tech.el();
  };
};
