import $ from 'jquery';
import _ from 'underscore';

export const hideText = (function() {
  function element() {
    return $('body');
  }

  function prefix(event) {
    return _.map(event.split(' '), function(e) {
      return 'hidetext' + e;
    }).join(' ');
  }

  $(function() {
    element().on('keydown', function(event) {
      if(event.keyCode == 27) {
        hideText.deactivate();
      }
    });
  });

  return {
    isActive: function() {
      return element().hasClass('hideText');
    },

    toggle: function() {
      if (this.isActive()) {
        this.deactivate();
      }
      else {
        this.activate();
      }
    },

    activate: function() {
      if (!this.isActive()) {
        element().addClass('hideText');
        element().trigger('hidetextactivate');
      }
    },

    deactivate: function() {
      if (this.isActive()) {
        element().removeClass('hideText');
        element().trigger('hidetextdeactivate');
      }
    },

    on: function(event, callback) {
      element().on(prefix(event), callback);
    },

    off: function(event, callback) {
      element().off(prefix(event), callback);
    }
  };
}());