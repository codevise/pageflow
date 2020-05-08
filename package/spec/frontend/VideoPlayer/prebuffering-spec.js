import '$support/fakeBrowserFeatures';
import {prebuffering} from 'frontend/VideoPlayer/prebuffering';
import {createTimeRange} from "$support/timeRanges";

describe('VideoPlayer', function() {
  describe('#prebuffering', function() {
    it('returns promise which resolves if video has already buffered enough', async () => {
      const player = fakePlayer()

      prebuffering(player);
      player.buffered.mockReturnValue(createTimeRange(0,11));

      const options = {
        secondsToBuffer: 10,
        secondsToWait: 1
      }

      await expect(player.prebuffer(options)).resolves.toBeUndefined();
      expect(player.buffered).toHaveBeenCalledTimes(1)
    });

    it('returns promise which resolves if video fails to buffer after too much waiting', async () => {
      const player = fakePlayer()

      prebuffering(player);
      player.buffered.mockReturnValue(createTimeRange(0,1));

      const options = {
        secondsToBuffer: 10,
        secondsToWait: 0.1
      }

      await expect(player.prebuffer(options)).resolves.toBeUndefined();
      expect(player.buffered).toHaveBeenCalledTimes(2)
    });

    it('returns promise which resolves after prebuffering desired time', async () => {
      const player = fakePlayer();

      prebuffering(player);
      player.buffered
            .mockReturnValueOnce(createTimeRange(0,2))
            .mockReturnValueOnce(createTimeRange(0,4))
            .mockReturnValueOnce(createTimeRange(0,6))
            .mockReturnValueOnce(createTimeRange(0,8))
            .mockReturnValueOnce(createTimeRange(0,10));

      const options = {
        secondsToBuffer: 10,
        secondsToWait: 1
      }

      await expect(player.prebuffer(options)).resolves.toBeUndefined();
      expect(player.buffered).toHaveBeenCalledTimes(5)
    });

    it('aborts prebuffering on pause', async () => {
      const player = fakePlayer();

      prebuffering(player);
      player.buffered.mockReturnValue(createTimeRange(0,2))

      const promise = player.prebuffer();
      player.pause();

      await expect(promise).rejects.toBe('prebuffering aborted');
    });
  });

  function fakePlayer() {
    const player = {
      src: function() {
        return 'videoSource';
      },

      currentTime: function() {
        return 0;
      },

      duration: function() {
        return 60;
      },

      buffered: jest.fn(),

      one: function() {},
      pause: function() {}
    };

    return player;
  }
});
