import $ from 'jquery';
import {Audio, events} from 'pageflow/frontend';
import {links} from './links';
import {nativeScrolling} from './nativeScrolling';
import {delayedStart} from './delayedStart';
import {widgetTypes} from './widgetTypes';
import {phoneLandscapeFullscreen} from './phoneLandscapeFullscreen';
import {state} from './state';
import {SeedEntryData} from './SeedEntryData';
import {FocusOutline} from './FocusOutline';
import {Slideshow} from './slideshow';
import {ready} from './ready';

ready.then(function() {
  var slideshow = $('[data-role=slideshow]');
  var body = $('body');

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