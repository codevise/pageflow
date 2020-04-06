import jQuery from 'jquery';
import {settings} from 'pageflow/frontend';

(function($) {
  $.widget('pageflow.muteButton', {
    _create: function() {
      var element = this.element;
      var volumeBeforeMute = 1;

      element.on('click', toggleMute);

      settings.on('change:volume', this.update, this);
      this.update();

      function toggleMute() {
        if (settings.get('volume') > 0) {
          volumeBeforeMute = settings.get('volume');
          settings.set('volume', 0);
        }
        else {
          settings.set('volume', volumeBeforeMute);
        }
      }
    },

    _destroy: function() {
      settings.off('change:volume', this.update);
    },

    update: function() {
      var volume = settings.get('volume');

      if (volume === 0) {
        this.element
          .attr('title', this.element.attr('data-muted-title'))
          .addClass('muted');
      }
      else {
        this.element
          .attr('title', this.element.attr('data-not-muted-title'))
          .removeClass('muted');
      }
    }
  });
}(jQuery));
