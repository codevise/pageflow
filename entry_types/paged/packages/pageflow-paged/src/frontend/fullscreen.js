import $ from 'jquery';
import Object from './Object'

var Fullscreen = Object.extend({
  toggle: function() {
    var fullscreen = this;

    if ($.support.fullscreen) {
      $('#outer_wrapper').fullScreen({
        callback: function(active) {
          fullscreen._active = active;
          fullscreen.trigger('change');
        }
      });
    }
  },

  isSupported: function() {
    return $.support.fullscreen;
  },

  isActive: function() {
    return this._active;
  }
});

export const fullscreen = new Fullscreen();