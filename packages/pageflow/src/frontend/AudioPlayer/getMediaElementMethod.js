export const getMediaElementMethod = function(player) {
  player.getMediaElement = function() {
    return player.audio.audio;
  };
};
