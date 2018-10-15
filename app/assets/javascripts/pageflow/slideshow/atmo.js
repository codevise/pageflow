(function() {
  var attributeName = 'atmo_audio_file_id';

  pageflow.Atmo = pageflow.Object.extend({
    initialize: function(options) {
      this.slideshow = options.slideshow;
      this.multiPlayer = options.multiPlayer;
      this.backgroundMedia = options.backgroundMedia;
      this.disabled = pageflow.browser.has('mobile platform');

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

      pageflow.events.trigger('atmo:disabled');
    },

    enable: function() {
      this.disabled = false;
      this.update();

      pageflow.events.trigger('atmo:enabled');
    },

    pause: function() {
      if (pageflow.browser.has('volume control support')) {
        return this.multiPlayer.fadeOutAndPause();
      }
      else {
        this.multiPlayer.pause();
      }
    },

    turnDown: function() {
      if (pageflow.browser.has('volume control support')) {
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

  pageflow.Atmo.create = function(slideshow, events, audio, backgroundMedia) {
    return new pageflow.Atmo({
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

  pageflow.Atmo.duringPlaybackModes = ['play', 'mute', 'turn_down'];
}());
