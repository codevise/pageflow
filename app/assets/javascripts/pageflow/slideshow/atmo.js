(function() {
  var attributeName = 'atmo_audio_file_id';

  pageflow.Atmo = pageflow.Object.extend({
    initialize: function(slideshow, events, multiPlayer) {
      this.slideshow = slideshow;
      this.multiPlayer = multiPlayer;
      this.disabled = pageflow.browser.has('mobile platform');

      this.listenTo(events, 'page:change page:update', function() {
        this.update();
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
        if (this.disabled) {
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
        this.multiPlayer.fadeTo(configuration[attributeName]);
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

  pageflow.Atmo.create = function(slideshow, events, audio) {
    return new pageflow.Atmo(
      slideshow,
      events,
      audio.createMultiPlayer({
        loop: true,
        fadeDuration: 500,
        crossFade: true,
        playFromBeginning: false,
        rewindOnChange: true,
        pauseInBackground: true
      })
    );
  };

  pageflow.Atmo.duringPlaybackModes = ['play', 'mute', 'turn_down'];
}());
