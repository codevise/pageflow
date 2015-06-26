describe('pageflow.mediaPlayer.volumeBinding', function() {
  describe('#play', function() {
    it('sets volume to settings volume', function() {
      var player = fakePlayer();
      var settings = new Backbone.Model({volume: 98});
      pageflow.mediaPlayer.volumeBinding(player, settings);

      player.play();

      expect(player.currentVolume).to.eq(98);
    });

    it('starts listenting to settings changes', function() {
      var player = fakePlayer();
      var settings = new Backbone.Model({volume: 98});
      pageflow.mediaPlayer.volumeBinding(player, settings);

      player.play();
      settings.set('volume', 50);

      expect(player.fadingVolume).to.eq(50);
    });

    it('calls original play method', function() {
      var player = fakePlayer();
      var settings = new Backbone.Model({volume: 98});
      pageflow.mediaPlayer.volumeBinding(player, settings);

      player.play();

      expect(player.originalPlay).to.have.been.called;
    });

    describe('with volumeFactor option', function() {
      it('sets volume to multiplied settings volume', function() {
        var player = fakePlayer();
        var settings = new Backbone.Model({volume: 100});
        pageflow.mediaPlayer.volumeBinding(player, settings, {volumeFactor: 0.5});

        player.play();

        expect(player.currentVolume).to.eq(50);
      });
    });
  });

  describe('#playAndFadeIn', function() {
    it('fades from 0 to settings volume', function() {
      var player = fakePlayer();
      var settings = new Backbone.Model({volume: 98});
      pageflow.mediaPlayer.volumeBinding(player, settings);

      player.playAndFadeIn(500);

      expect(player.currentVolume).to.eq(0);
      expect(player.fadingVolume).to.eq(98);
      expect(player.fadingDuration).to.eq(500);
    });

    it('starts listenting to settings changes', function() {
      var player = fakePlayer();
      var settings = new Backbone.Model({volume: 98});
      pageflow.mediaPlayer.volumeBinding(player, settings);

      player.playAndFadeIn(500);
      settings.set('volume', 50);

      expect(player.fadingVolume).to.eq(50);
    });

    it('does not fade in until promise returned by play is resolved', function() {
      var player = fakePlayer();
      var settings = new Backbone.Model({volume: 98});
      var deferred = new jQuery.Deferred();
      player.play = function() { return deferred.promise(); };
      pageflow.mediaPlayer.volumeBinding(player, settings);

      player.playAndFadeIn(500);

      expect(player.fadingVolume).to.eq(undefined);
    });

    it('fades in after promise returned by play is resolved', function() {
      var player = fakePlayer();
      var settings = new Backbone.Model({volume: 98});
      var deferred = new jQuery.Deferred();
      player.play = function() { return deferred.promise(); };
      pageflow.mediaPlayer.volumeBinding(player, settings);

      player.playAndFadeIn(500);
      deferred.resolve();

      expect(player.fadingVolume).to.eq(98);
    });

    it('returns fadeVolume promise', function() {
      var player = fakePlayer();
      var settings = new Backbone.Model({volume: 98});
      var callback = sinon.spy();
      pageflow.mediaPlayer.volumeBinding(player, settings);

      player.playAndFadeIn(500).then(callback);
      player.fadingDeferred.resolve();

      expect(callback).to.be.have.been.called;
    });

    it('calls original play method', function() {
      var player = fakePlayer();
      var settings = new Backbone.Model({volume: 98});
      pageflow.mediaPlayer.volumeBinding(player, settings);

      player.playAndFadeIn();

      expect(player.originalPlay).to.have.been.called;
    });

    it('returns resolved promise if alreay playing', function() {
      var player = fakePlayer({playing: true});
      var settings = new Backbone.Model({volume: 98});
      var callback = sinon.spy();
      pageflow.mediaPlayer.volumeBinding(player, settings);

      player.playAndFadeIn(500).then(callback);

      expect(callback).to.have.been.called;
    });

    describe('with volumeFactor option', function() {
      it('fades to multiplied settings volume', function() {
        var player = fakePlayer();
        var settings = new Backbone.Model({volume: 100});
        pageflow.mediaPlayer.volumeBinding(player, settings, {volumeFactor: 0.5});

        player.playAndFadeIn(500);

        expect(player.currentVolume).to.eq(0);
        expect(player.fadingVolume).to.eq(50);
        expect(player.fadingDuration).to.eq(500);
      });

      it('uses multiplied volume on settings change', function() {
        var player = fakePlayer();
        var settings = new Backbone.Model({volume: 100});
        pageflow.mediaPlayer.volumeBinding(player, settings, {volumeFactor: 0.5});

        player.playAndFadeIn(500);
        settings.set('volume', 80);

        expect(player.fadingVolume).to.eq(40);
      });
    });
  });

  describe('#pause', function() {
    it('stops listenting to settings changes', function() {
      var player = fakePlayer();
      var settings = new Backbone.Model({volume: 98});
      pageflow.mediaPlayer.volumeBinding(player, settings);

      player.play();
      player.pause();
      settings.set('volume', 50);

      expect(player.fadingVolume).to.eq(undefined);
    });

    it('calls original play method', function() {
      var player = fakePlayer();
      var settings = new Backbone.Model();
      pageflow.mediaPlayer.volumeBinding(player, settings);

      player.pause();

      expect(player.originalPause).to.have.been.called;
    });
  });

  describe('#fadeOutAndPause', function() {
    it('fades to 0', function() {
      var player = fakePlayer({playing: true});
      var settings = new Backbone.Model({volume: 98});
      pageflow.mediaPlayer.volumeBinding(player, settings);

      player.fadeOutAndPause(500);

      expect(player.fadingVolume).to.eq(0);
      expect(player.fadingDuration).to.eq(500);
    });

    it('stops listenting to settings changes', function() {
      var player = fakePlayer({playing: true});
      var settings = new Backbone.Model({volume: 98});
      pageflow.mediaPlayer.volumeBinding(player, settings);

      player.play();
      player.fadeOutAndPause(500);
      settings.set('volume', 50);

      expect(player.fadingVolume).to.eq(0);
    });

    it('calls original pause when fading promise resolves', function() {
      var player = fakePlayer({playing: true});
      var settings = new Backbone.Model({volume: 98});
      pageflow.mediaPlayer.volumeBinding(player, settings);

      player.fadeOutAndPause(500);

      expect(player.originalPause).not.to.have.been.called;
      player.fadingDeferred.resolve();
      expect(player.originalPause).to.have.been.called;
    });

    it('returns fadeVolume promise', function() {
      var player = fakePlayer({playing: true});
      var settings = new Backbone.Model({volume: 98});
      pageflow.mediaPlayer.volumeBinding(player, settings);
      var callback = sinon.spy();

      player.fadeOutAndPause(500).then(callback);

      player.fadingDeferred.resolve();
      expect(callback).to.have.been.called;
    });

    it('returns resolved promise if not playing', function() {
      var player = fakePlayer({playing: false});
      var settings = new Backbone.Model({volume: 98});
      pageflow.mediaPlayer.volumeBinding(player, settings);
      var callback = sinon.spy();

      player.fadeOutAndPause(500).then(callback);

      expect(callback).to.have.been.called;
    });
  });

  describe('#changeVolumeFactor', function() {
    it('fades to new multiplied volume', function() {
      var player = fakePlayer();
      var settings = new Backbone.Model({volume: 100});
      pageflow.mediaPlayer.volumeBinding(player, settings, {volumeFactor: 1});

      player.changeVolumeFactor(0.5, 500);

      expect(player.currentVolume).to.eq(100);
      expect(player.fadingVolume).to.eq(50);
      expect(player.fadingDuration).to.eq(500);
    });

    it('returns fadeVolume promise', function() {
      var player = fakePlayer({playing: true});
      var settings = new Backbone.Model({volume: 98});
      pageflow.mediaPlayer.volumeBinding(player, settings);
      var callback = sinon.spy();

      player.changeVolumeFactor(0.5, 500).then(callback);

      player.fadingDeferred.resolve();
      expect(callback).to.have.been.called;
    });
  });

  function fakePlayer(options) {
    options = options || {};

    var playSpy = sinon.spy();
    var pauseSpy = sinon.spy();

    return {
      currentVolume: 100,

      play: playSpy,
      originalPlay: playSpy,

      pause: pauseSpy,
      originalPause: pauseSpy,

      paused: function() {
        return !options.playing;
      },

      volume: function(value) {
        this.currentVolume = value;
      },

      fadeVolume: function(value, duration) {
        this.fadingVolume = value;
        this.fadingDuration = duration;
        this.fadingDeferred = new jQuery.Deferred();

        return this.fadingDeferred.promise();
      }
    };
  }
});