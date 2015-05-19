(function() {
  var attributeName = 'atmo_audio_file_id';

  pageflow.Atmo = pageflow.Object.extend({
    initialize: function(slideshow, events, multiPlayer) {
      this.slideshow = slideshow;
      this.multiPlayer = multiPlayer;

      this.listenTo(events, 'page:change page:update', function() {
        this.update();
      });
    },

    pause: function() {
      return this.multiPlayer.fadeOutAndPause();
    },

    turnDown: function() {
      return this.multiPlayer.changeVolumeFactor(0.2);
    },

    resume: function() {
      if (this.multiPlayer.paused()) {
        return this.multiPlayer.resumeAndFadeIn();
      }
      else {
        return this.multiPlayer.changeVolumeFactor(1);
      }
    },

    update: function() {
      var configuration = this.slideshow.currentPageConfiguration();
      this.multiPlayer.fadeTo(configuration[attributeName]);
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
        playFromBeginning: false
      })
    );
  };

  pageflow.Atmo.duringPlaybackModes = ['play', 'mute', 'turn_down'];
}());