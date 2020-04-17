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
    it('resolves if intending to play', function() {
      var player = fakePlayer();
      asyncPlay(player);
      var handler = sinon.spy();

      player.intendToPlay();
      player.ifIntendingToPlay().then(handler);

      expect(handler).toHaveBeenCalled();
    });

    it('rejects if not intending to play', function() {
      var player = fakePlayer();
      asyncPlay(player);
      var handler = sinon.spy();

      player.ifIntendingToPlay().fail(handler);

      expect(handler).toHaveBeenCalled();
    });
  });

  describe('#ifIntendingToPause', function() {
    it('resolves if intending to pause', function() {
      var player = fakePlayer();
      asyncPlay(player);
      var handler = sinon.spy();

      player.intendToPause();
      player.ifIntendingToPause().then(handler);

      expect(handler).toHaveBeenCalled();
    });

    it('rejects if not intending to pause', function() {
      var player = fakePlayer();
      asyncPlay(player);
      var handler = sinon.spy();

      player.ifIntendingToPause().fail(handler);

      expect(handler).toHaveBeenCalled();
    });
  });

  function fakePlayer() {
    return {
      play: sinon.spy(),
      pause: sinon.spy()
    };
  }
});