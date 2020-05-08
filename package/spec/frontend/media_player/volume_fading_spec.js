import {mediaPlayer} from 'pageflow/frontend';

import '$support/fakeBrowserFeatures';

describe('mediaPlayer.volumeFading', function() {
  var volumeFading = mediaPlayer.volumeFading;
  describe('#volume', function() {
    it('resolves promise of running fade', async () => {
      const player = fakePlayer({volume: 100});
      volumeFading(player);

      const promise = player.fadeVolume(50, 10);
      player.volume(90);

      await expect(promise).resolves.toBe('cancelled');
    });
  });

  describe('#fadeVolume', function() {
    it('resolves promise after fading down', function() {
      var player = fakePlayer({volume: 100});
      volumeFading(player);

      return player.fadeVolume(50, 10).then(function() {
        expect(player.volume()).toBe(50);
      });
    });

    it('resolves promise after fading up', function() {
      var player = fakePlayer({volume: 50});
      volumeFading(player);

      return player.fadeVolume(100, 10).then(function() {
        expect(player.volume()).toBe(100);
      });
    });

    it('resolves promise if unchanged', function() {
      var player = fakePlayer({volume: 100});
      volumeFading(player);

      return player.fadeVolume(100, 10).then(function() {
        expect(player.volume()).toBe(100);
      });
    });

    it('does not change volume directly', function() {
      var player = fakePlayer({volume: 50});
      volumeFading(player);

      var promise = player.fadeVolume(100, 10);
      expect(player.volume()).toBe(50);
      return promise;
    });

    it('resolves promise if called again before fade is finished', async () => {
      var player = fakePlayer({volume: 100});
      volumeFading(player);

      const promise = player.fadeVolume(50, 10);
      player.fadeVolume(90, 10);

      await expect(promise).resolves.toBe('cancelled');
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
