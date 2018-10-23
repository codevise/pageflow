pageflow.navigationDirection = (function() {
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
      return pageflow.widgets.isPresent('phone_horizontal_slideshow_mode');
    },

    isHorizontal: function() {
      return this.isHorizontalOnPhone() &&
             pageflow.browser.has('phone platform');
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
