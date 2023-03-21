import {events} from '../events';
import {throttle} from '../utils/throttle';

export const mediaEvents = function(player, context) {
  function triggerMediaEvent(name) {
    events.trigger('media:' + name, {
      fileName: player.currentSrc,
      context: context,
      currentTime: player.position,
      duration: player.duration,
      volume: player.volume(),
      bitrate: 128000
    });
  }

  player.on('play', function() {
    triggerMediaEvent('play');
  });

  player.on('timeupdate', function() {
    triggerMediaEvent('timeupdate');
  });

  player.on('timeupdate', throttle(function() {
    triggerMediaEvent('timeupdate_throttled');
  }, 5000));

  player.on('pause', function() {
    triggerMediaEvent('pause');
  });

  player.on('ended', function() {
    triggerMediaEvent('ended');
  });
};
