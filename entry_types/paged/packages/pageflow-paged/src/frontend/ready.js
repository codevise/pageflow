import $ from 'jquery';
import {Audio, browser, events} from 'pageflow/frontend';
import {links} from './links';
import {nativeScrolling} from './nativeScrolling';
import {delayedStart} from './delayedStart';
import {widgetTypes} from './widgetTypes';
import {Visited} from './Visited';
import {phoneLandscapeFullscreen} from './phoneLandscapeFullscreen';
import {state} from './state';
import {SeedEntryData} from './SeedEntryData';
import {FocusOutline} from './FocusOutline';
import {Slideshow} from './slideshow';


export const ready = new $.Deferred(function(readyDeferred) {
  var pagePreloaded = new $.Deferred(function(pagePreloadedDeferred) {
    $(document).one('pagepreloaded', pagePreloadedDeferred.resolve);
  }).promise();

  window.onload = function() {
    browser.detectFeatures().then(function() {
      var slideshow = $('[data-role=slideshow]');
      var body = $('body');

      Visited.setup();

      pagePreloaded.then(function() {
        readyDeferred.resolve();
        events.trigger('ready');
      });

      slideshow.each(function() {
        events.trigger('seed:loaded');

        state.entryData = new SeedEntryData(
          state.seed
        );

        Audio.setup({
          audioFiles: state.audioFiles
        });

        Slideshow.setup({
          element: $(this),
          pages: state.pages,
          enabledFeatureNames: state.enabledFeatureNames,

          beforeFirstUpdate: function() {
            $('.header').header({slideshow: state.slides});
            $('.overview').overview();
            $('.multimedia_alert').multimediaAlert();

            widgetTypes.enhance(body);
            delayedStart.perform();
            phoneLandscapeFullscreen();
          }
        });
      });

      links.setup();
      FocusOutline.setup(body);
      nativeScrolling.preventScrollingOnEmbed(slideshow);
    });
  };
}).promise();