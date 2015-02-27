describe('pageflow.AudioPlayer.volumeFading', function() {
  describe('#fadeVolume', function() {
    it('resolves promise after fading down', function(done) {
      var player = fakePlayer({volume: 100});
      pageflow.AudioPlayer.volumeFading(player);

      player.fadeVolume(50, 10).then(function() {
        expect(player.volume()).to.eq(50);

        done();
      });
    });

    it('resolves promise after fading up', function(done) {
      var player = fakePlayer({volume: 50});
      pageflow.AudioPlayer.volumeFading(player);

      player.fadeVolume(100, 10).then(function() {
        expect(player.volume()).to.eq(100);
        done();
      });
    });

    it('does not change volume directly', function(done) {
      var player = fakePlayer({volume: 50});
      pageflow.AudioPlayer.volumeFading(player);

      player.fadeVolume(100, 10).then(done);
      expect(player.volume()).to.eq(50);
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
        }
      };
    }
  });
});