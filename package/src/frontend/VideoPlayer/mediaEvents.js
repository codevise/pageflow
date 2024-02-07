import {events} from '../events';
import {throttle} from '../utils/throttle';

export const mediaEvents = function(player, context) {

  player.updateMediaEventsContext = function (newContext) {
    context = newContext;
  }

  function triggerMediaEvent(name) {
    if (context) {
      events.trigger('media:' + name, {
        fileName: player.previousSrc || player.currentSrc(),
        context: context,
        currentTime: player.currentTime(),
        duration: player.duration(),
        volume: player.volume(),
        altText: player.getMediaElement().getAttribute('alt'),
        bitrate: 3500000
      });
    }
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
