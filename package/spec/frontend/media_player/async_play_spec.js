import sinon from 'sinon';
import {mediaPlayer} from 'pageflow/frontend';

describe('mediaPlayer.asyncPlay', function() {
  var asyncPlay = mediaPlayer.asyncPlay;
  describe('#play', function() {
    it('sets intendingToPlay to true', function() {
      var player = fakePlayer();
      asyncPlay(player);

      player.play();

      expect(player.intendingToPlay()).toBe(true);
    });

    it('sets intendingToPause to false', function() {
      var player = fakePlayer();
      asyncPlay(player);

      player.play();

      expect(player.intendingToPause()).toBe(false);
    });
  });

  describe('#pause', function() {
    it('sets intendingToPause to true', function() {
      var player = fakePlayer();
      asyncPlay(player);

      player.pause();

      expect(player.intendingToPause()).toBe(true);
    });

    it('sets intendingToPlay to false', function() {
      var player = fakePlayer();
      asyncPlay(player);

      player.pause();

      expect(player.intendingToPlay()).toBe(false);
    });
  });

  describe('#ifIntendingToPlay', function() {
    it('resolves if intending to play', async () => {
      const player = fakePlayer();
      asyncPlay(player);

      player.intendToPlay();
      const promise = player.ifIntendingToPlay();

      await expect(promise).resolves.toBeUndefined();
    });

    it('rejects if not intending to play', async () => {
      const player = fakePlayer();
      asyncPlay(player);

      const promise = player.ifIntendingToPlay();

      await expect(promise).rejects.toEqual('aborted');
    });
  });

  describe('#ifIntendingToPause', function() {
    it('resolves if intending to pause', async () => {
      var player = fakePlayer();
      asyncPlay(player);

      player.intendToPause();
      const promise = player.ifIntendingToPause();

      await expect(promise).resolves.toBeUndefined();
    });

    it('rejects if not intending to pause', async () => {
      const player = fakePlayer();
      asyncPlay(player);

      const promise = player.ifIntendingToPause();

      await expect(promise).rejects.toEqual('aborted');
    });
  });

  function fakePlayer() {
    return {
      play: sinon.spy(),
      pause: sinon.spy()
    };
  }
});