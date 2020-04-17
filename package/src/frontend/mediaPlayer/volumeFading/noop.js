export const noop = function(player) {
  player.fadeVolume = function(value, duration) {
    return Promise.resolve();
  };
};
