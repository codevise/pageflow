import jQuery from 'jquery';

export const noop = function(player) {
  player.fadeVolume = function(value, duration) {
    return new jQuery.Deferred().resolve().promise();
  };
};
