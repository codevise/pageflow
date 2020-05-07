import '$support/fakeBrowserFeatures';
import {prebuffering} from 'frontend/VideoPlayer/prebuffering';
import {createTimeRange} from "$support/timeRanges";
import sinon from 'sinon';


describe('VideoPlayer', function() {
  describe('#prebuffering', function() {
    it('returns promise which resolves after prebuffering desired time', async () => {
      const player = fakePlayer();
      const callback = sinon.spy();

      prebuffering(player);

      const options = {
        secondsToBuffer: 10,
        secondsToWait: 1
      }
      await player.prebuffer(options).then(callback);

      expect(player.buffered).toHaveBeenCalledTimes(5)
      expect(callback).toHaveBeenCalled();
    });

    it('aborts prebuffering on pause', function() {
      const player = fakePlayer();
      const callback = sinon.spy();

      prebuffering(player);

      player.prebuffer().then(callback);
      player.pause();

      expect(callback).not.toHaveBeenCalled();
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

      buffered: jest.fn()
        .mockReturnValueOnce(createTimeRange(0,2))
        .mockReturnValueOnce(createTimeRange(0,4))
        .mockReturnValueOnce(createTimeRange(0,6))
        .mockReturnValueOnce(createTimeRange(0,8))
        .mockReturnValueOnce(createTimeRange(0,10)),

      one: function() {},
      pause: function() {}
    };

    return player;
  }
});
