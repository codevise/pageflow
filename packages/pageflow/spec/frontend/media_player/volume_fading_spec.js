describe('pageflow.mediaPlayer.volumeFading', function() {
  describe('#volume', function() {
    it('rejects promise of running fade', function() {
      var failHandler = sinon.spy();
      var player = fakePlayer({volume: 100});
      pageflow.mediaPlayer.volumeFading(player);

      player.fadeVolume(50, 10).fail(failHandler);
      player.volume(90);

      expect(failHandler).to.have.been.called;
    });
  });

  describe('#fadeVolume', function() {
    it('resolves promise after fading down', function(done) {
      var player = fakePlayer({volume: 100});
      pageflow.mediaPlayer.volumeFading(player);

      player.fadeVolume(50, 10).then(function() {
        expect(player.volume()).to.eq(50);

        done();
      });
    });

    it('resolves promise after fading up', function(done) {
      var player = fakePlayer({volume: 50});
      pageflow.mediaPlayer.volumeFading(player);

      player.fadeVolume(100, 10).then(function() {
        expect(player.volume()).to.eq(100);
        done();
      });
    });

    it('resolves promise if unchanged', function(done) {
      var player = fakePlayer({volume: 100});
      pageflow.mediaPlayer.volumeFading(player);

      player.fadeVolume(100, 10).then(function() {
        expect(player.volume()).to.eq(100);
        done();
      });
    });

    it('does not change volume directly', function(done) {
      var player = fakePlayer({volume: 50});
      pageflow.mediaPlayer.volumeFading(player);

      player.fadeVolume(100, 10).then(done);
      expect(player.volume()).to.eq(50);
    });

    it('rejects promise if called again before fade is finished', function(done) {
      var failHandler = sinon.spy();
      var player = fakePlayer({volume: 100});
      pageflow.mediaPlayer.volumeFading(player);

      player.fadeVolume(50, 10).fail(failHandler);
      player.fadeVolume(90, 10).then(function() {
        expect(failHandler).to.have.been.called;
        done();
      });
    });
  });

  function fakePlayer(options) {
    var volume = options.volume;

    return {
      volume: function(value) {
        if (typeof value === 'undefined') {
          return volume;
        }
        else {
          volume = value;
        }
      },

      on: function() {},
      one: function() {},
      off: function() {}
    };
  }
});