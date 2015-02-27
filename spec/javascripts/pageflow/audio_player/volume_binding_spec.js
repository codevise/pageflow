describe('pageflow.AudioPlayer.volumeBinding', function() {
  describe('#play', function() {
    it('sets volume to settings volume', function() {
      var player = fakePlayer();
      var settings = new Backbone.Model({volume: 98});
      pageflow.AudioPlayer.volumeBinding(player, settings);

      player.play();

      expect(player.currentVolume).to.eq(98);
    });

    it('starts listenting to settings changes', function() {
      var player = fakePlayer();
      var settings = new Backbone.Model({volume: 98});
      pageflow.AudioPlayer.volumeBinding(player, settings);

      player.play();
      settings.set('volume', 50);

      expect(player.fadingVolume).to.eq(50);
    });

    it('calls original play method', function() {
      var player = fakePlayer();
      var settings = new Backbone.Model({volume: 98});
      pageflow.AudioPlayer.volumeBinding(player, settings);

      player.play();

      expect(player.originalPlay).to.have.been.called;
    });
  });

  describe('#playAndFadeIn', function() {
    it('fades from 0 to settings volume', function() {
      var player = fakePlayer();
      var settings = new Backbone.Model({volume: 98});
      pageflow.AudioPlayer.volumeBinding(player, settings);

      player.playAndFadeIn(500);

      expect(player.currentVolume).to.eq(0);
      expect(player.fadingVolume).to.eq(98);
      expect(player.fadingDuration).to.eq(500);
    });

    it('starts listenting to settings changes', function() {
      var player = fakePlayer();
      var settings = new Backbone.Model({volume: 98});
      pageflow.AudioPlayer.volumeBinding(player, settings);

      player.playAndFadeIn(500);
      settings.set('volume', 50);

      expect(player.fadingVolume).to.eq(50);
    });

    it('return fadeVolume promise', function() {
      var player = fakePlayer();
      var settings = new Backbone.Model({volume: 98});
      pageflow.AudioPlayer.volumeBinding(player, settings);

      var result = player.playAndFadeIn(500);

      expect(result.then).to.be.defined;
    });

    it('calls original play method', function() {
      var player = fakePlayer();
      var settings = new Backbone.Model({volume: 98});
      pageflow.AudioPlayer.volumeBinding(player, settings);

      player.playAndFadeIn();

      expect(player.originalPlay).to.have.been.called;
    });
  });

  describe('#pause', function() {
    it('stops listenting to settings changes', function() {
      var player = fakePlayer();
      var settings = new Backbone.Model({volume: 98});
      pageflow.AudioPlayer.volumeBinding(player, settings);

      player.play();
      player.pause();
      settings.set('volume', 50);

      expect(player.fadingVolume).to.eq(undefined);
    });

    it('calls original play method', function() {
      var player = fakePlayer();
      var settings = new Backbone.Model();
      pageflow.AudioPlayer.volumeBinding(player, settings);

      player.pause();

      expect(player.originalPause).to.have.been.called;
    });
  });

  describe('#fadeOutAndPause', function() {
    it('fades to 0', function() {
      var player = fakePlayer();
      var settings = new Backbone.Model({volume: 98});
      pageflow.AudioPlayer.volumeBinding(player, settings);

      player.fadeOutAndPause(500);

      expect(player.fadingVolume).to.eq(0);
      expect(player.fadingDuration).to.eq(500);
    });

    it('stops listenting to settings changes', function() {
      var player = fakePlayer();
      var settings = new Backbone.Model({volume: 98});
      pageflow.AudioPlayer.volumeBinding(player, settings);

      player.play();
      player.fadeOutAndPause(500);
      settings.set('volume', 50);

      expect(player.fadingVolume).to.eq(0);
    });

    it('calls original pause when fading promise resolves', function() {
      var player = fakePlayer();
      var settings = new Backbone.Model({volume: 98});
      pageflow.AudioPlayer.volumeBinding(player, settings);

      player.fadeOutAndPause(500);

      expect(player.originalPause).not.to.have.been.called;
      player.fadingDeferred.resolve();
      expect(player.originalPause).to.have.been.called;
    });

    it('returns fadeVolume promise', function() {
      var player = fakePlayer();
      var settings = new Backbone.Model({volume: 98});
      pageflow.AudioPlayer.volumeBinding(player, settings);
      var callback = sinon.spy();

      player.fadeOutAndPause(500).then(callback);

      player.fadingDeferred.resolve();
      expect(callback).to.have.been.called;
    });
  });

  function fakePlayer() {
    var playSpy = sinon.spy();
    var pauseSpy = sinon.spy();

    return {
      currentVolume: 100,

      play: playSpy,
      originalPlay: playSpy,

      pause: pauseSpy,
      originalPause: pauseSpy,

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