import {events} from '../events';

export const mediaEvents = function(player, context) {
  
  player.updateMediaEventsContext = function (newContext) {
    context = newContext;
  }  

  function triggerMediaEvent(name) {
    if (context) {
      events.trigger('media:' + name, {
        fileName: player.currentSrc(),
        context: context,
        currentTime: player.currentTime(),
        duration: player.duration(),
        volume: player.volume(),
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

  player.on('pause', function() {
    triggerMediaEvent('pause');
  });

  player.on('ended', function() {
    triggerMediaEvent('ended');
  });

};
