import $ from 'jquery';
import Object from '../Object'
import {browser, events} from 'pageflow/frontend';


var attributeName = 'atmo_audio_file_id';

export const Atmo = Object.extend({
  initialize: function(options) {
    this.slideshow = options.slideshow;
    this.multiPlayer = options.multiPlayer;
    this.backgroundMedia = options.backgroundMedia;
    this.disabled = browser.has('mobile platform');

    this.listenTo(options.events, 'page:change page:update background_media:unmute', function() {
      this.update();
    });

    this.listenTo(options.multiPlayer, 'playfailed', function() {
      options.backgroundMedia.mute();
    });
  },

  disable: function() {
    this.disabled = true;
    this.multiPlayer.fadeOutAndPause();

    events.trigger('atmo:disabled');
  },

  enable: function() {
    this.disabled = false;
    this.update();

    events.trigger('atmo:enabled');
  },

  pause: function() {
    if (browser.has('volume control support')) {
      return this.multiPlayer.fadeOutAndPause();
    }
    else {
      this.multiPlayer.pause();
    }
  },

  turnDown: function() {
    if (browser.has('volume control support')) {
      return this.multiPlayer.changeVolumeFactor(0.2);
    }
    else {
      this.multiPlayer.pause();
    }
  },

  resume: function() {
    if (this.multiPlayer.paused()) {
      if (this.disabled || this.backgroundMedia.muted) {
        return new $.Deferred().resolve().promise();
      }
      else {
        return this.multiPlayer.resumeAndFadeIn();
      }
    }
    else {
      return this.multiPlayer.changeVolumeFactor(1);
    }
  },

  update: function() {
    var configuration = this.slideshow.currentPageConfiguration();

    if (!this.disabled) {
      if (this.backgroundMedia.muted) {
        this.multiPlayer.fadeOutAndPause();
      }
      else {
        this.multiPlayer.fadeTo(configuration[attributeName]);
      }
    }
  },

  createMediaPlayerHooks: function(configuration) {
    var atmo = this;

    return {
      before: function() {
        if (configuration.atmo_during_playback === 'mute') {
          atmo.pause();
        }
        else if (configuration.atmo_during_playback === 'turn_down') {
          atmo.turnDown();
        }
      },

      after: function() {
        atmo.resume();
      }
    };
  }
});

Atmo.create = function(slideshow, events, audio, backgroundMedia) {
  return new Atmo({
    slideshow: slideshow,
    events: events,
    backgroundMedia: backgroundMedia,
    multiPlayer: audio.createMultiPlayer({
      loop: true,
      fadeDuration: 500,
      crossFade: true,
      playFromBeginning: false,
      rewindOnChange: true,
      pauseInBackground: true
    })
  });
};

Atmo.duringPlaybackModes = ['play', 'mute', 'turn_down'];
