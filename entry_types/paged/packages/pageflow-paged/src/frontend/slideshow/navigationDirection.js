import {browser} from 'pageflow/frontend';
import {widgets} from '../widgets';

export const navigationDirection = (function() {
  var eventMapping = {
    v: {
      scrollerbumpnext: 'scrollerbumpdown',
      scrollerbumpback: 'scrollerbumpup',
      scrollerhintnext: 'scrollerhintdown',
      scrollerhintback: 'scrollerhintup',
    },
    h: {
      scrollerbumpnext: 'scrollerbumpright',
      scrollerbumpback: 'scrollerbumpleft',
      scrollerhintnext: 'scrollerhintright',
      scrollerhintback: 'scrollerhintleft',
    }
  };

  return {
    isHorizontalOnPhone: function() {
      return widgets.isPresent('phone_horizontal_slideshow_mode');
    },

    isHorizontal: function() {
      return this.isHorizontalOnPhone() &&
             browser.has('phone platform');
    },

    getEventName: function(name) {
      var result = eventMapping[this.isHorizontal() ? 'h' : 'v'][name];

      if (!result) {
        throw 'Unknown event name ' + name;
      }

      return result;
    }
  };
}());
