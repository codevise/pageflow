import jQuery from 'jquery';
import {manualStart} from '../manualStart';
import {backgroundMedia} from '../backgroundMedia';
import {nativeScrolling} from '../nativeScrolling';
import {events} from 'pageflow/frontend';

(function($) {
  $.widget('pageflow.multimediaAlert', {
    _create: function() {
      var widget = this;

      function show() {
        widget.element.show();
        toggleContent(false);
      }

      function hide() {
        widget.element.hide();
        toggleContent(true);
      }

      function toggleContent(state) {
        $('.page .content').toggleClass('initially_hidden', !state);
        $('.slideshow .scroll_indicator').toggleClass('initially_hidden', !state);
      }

      manualStart.required().then(function(start) {
        show();

        widget.element.find('.close').one('click', function() {
          hide();
          backgroundMedia.unmute();

          events.trigger('button:close_multimedia_alert');
          start();

          return false;
        });
      });

      events.on('request:multimedia_alert', function() {
        show();

        widget.element.find('.close').one('click', function() {
          hide();
        });
      }, this);

      nativeScrolling.preventScrollBouncing(this.element);
    }
  });
}(jQuery));
