import jQuery from 'jquery';
import {settings} from 'pageflow/frontend';

(function($) {
  $.widget('pageflow.volumeSlider', {
    _create: function() {
      var element = this.element;
      var orientation = this.options.orientation;
      var slider = $('.volume-slider', element);

      element.on('mousedown', function(event) {
        var parent = $('body');

        parent.on('mousemove.volumeSlider', changeVolume);
        element.addClass('lock_showing');

        parent.on('mouseup.volumeSlider', function() {
          parent.off('mousemove.volumeSlider mouseup.volumeSlider');
          element.removeClass('lock_showing');
        });

        changeVolume(event);

        function changeVolume(event) {
          var volume;

          if (orientation === 'v') {
            volume = 1 - (event.pageY - slider.offset().top) / slider.height();
          }
          else {
            volume = (event.pageX - slider.offset().left) / slider.width();
          }

          settings.set('volume', Math.min(1, Math.max(0, volume)));
        }
      });

      settings.on('change:volume', this.update, this);
      this.update();
    },

    _destroy: function() {
      settings.off('change:volume', this.update);
    },

    update: function() {
      var volume = settings.get('volume');

      if (this.options.orientation === 'v') {
        $('.volume-level', this.element).css({height: volume * 100 + '%'});
        $('.volume-handle', this.element).css({bottom: volume * 100 + '%', top: 'initial'});
      }
      else {
        $('.volume-level', this.element).css({width: volume * 100 + '%'});
        $('.volume-handle', this.element).css({left: volume * 100 + '%'});
      }

      this.element.toggleClass('volume-high', volume > 2 / 3);
      this.element.toggleClass('volume-medium', volume >= 1 / 3 && volume <= 2 / 3 );
      this.element.toggleClass('volume-low', volume < 1 / 3 && volume > 0);
      this.element.toggleClass('volume-mute', volume === 0);
    }
  });
}(jQuery));
