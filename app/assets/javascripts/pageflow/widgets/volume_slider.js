(function($) {
  $.widget('pageflow.volumeSlider', {
    _create: function() {
      var element = this.element;
      var orientation = this.options.orientation;
      var slider = $('.volume-slider', element);
      var handlingVolume = false;

      element.on('mousedown', function(event) {
        var parent = $('body');

        parent.on('mousemove.volumeSlider', changeVolume);

        parent.on('mouseup.volumeSlider', function() {
          parent.off('mousemove.volumeSlider mouseup.volumeSlider');
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

          pageflow.settings.set('volume', Math.min(1, Math.max(0, volume)));
        }
      });

      pageflow.settings.on('change:volume', this.update, this);
      this.update();
    },

    _destroy: function() {
      pageflow.settings.off('change:volume', this.update);
    },

    update: function() {
      var volume = pageflow.settings.get('volume');

      if (this.options.orientation === 'v') {
        $('.volume-level', this.element).css({height: volume * 100 + '%'});
      }
      else {
        $('.volume-level', this.element).css({width: volume * 100 + '%'});
      }

      this.element.toggleClass('volume-high', volume > 2 / 3);
      this.element.toggleClass('volume-medium', volume >= 1 / 3 && volume <= 2 / 3 );
      this.element.toggleClass('volume-low', volume < 1 / 3 && volume > 0);
      this.element.toggleClass('volume-mute', volume === 0);
    }
  });
}(jQuery));