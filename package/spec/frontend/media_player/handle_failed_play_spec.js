import _ from 'underscore';
import BackboneEvents from 'backbone-events-standalone';

import {mediaPlayer} from 'pageflow/frontend';

import sinon from 'sinon';

describe('pageflow.mediaPlayer.handleFailedPlay', function() {
  var handleFailedPlay = mediaPlayer.handleFailedPlay;
  
  it('triggers playfailed event when play returns rejected promise', function() {
    var player = fakePlayer();
    player.originalPlay.returns(rejectedAutoplayPromise());
    var playfailedHandler = sinon.spy();

    handleFailedPlay(player, {
      hasAutoplaySupport: true
    });
    player.on('playfailed', playfailedHandler);

    return player.play().then(function() {
      expect(playfailedHandler).toHaveBeenCalled();
    });
  });

  it('does not trigger playfailed event when play returns resolved promise', function() {
    var player = fakePlayer();
    player.originalPlay.returns(Promise.resolve());
    var playfailedHandler = sinon.spy();

    handleFailedPlay(player, {
      hasAutoplaySupport: true
    });
    player.on('playfailed', playfailedHandler);

    return player.play().then(function() {
      expect(playfailedHandler).not.toHaveBeenCalled();
    });
  });

  it('does not fall back to muted play by default', function() {
    var player = fakePlayer();
    player.originalPlay.returns(rejectedAutoplayPromise());

    handleFailedPlay(player, {
      hasAutoplaySupport: true
    });

    return player.play().then(function() {
      expect(player.originalPlay).toHaveBeenCalledOnce();
    });
  });

  describe('on browsers without autoplay support', function() {
    it('does not trigger playfailed event when play returns rejected promise', function() {
      var player = fakePlayer();
      player.originalPlay.returns(rejectedAutoplayPromise());
      var playfailedHandler = sinon.spy();

      handleFailedPlay(player, {
        hasAutoplaySupport: false
      });
      player.on('playfailed', playfailedHandler);

      return player.play().then(function() {
        expect(playfailedHandler).not.toHaveBeenCalled();
      });
    });
  });

  describe('when play does not return promise', function() {
    it('does nothing', function() {
      var player = fakePlayer();
      player.originalPlay.returns(undefined);
      var playfailedHandler = sinon.spy();

      handleFailedPlay(player, {
        hasAutoplaySupport: true
      });
      player.on('playfailed', playfailedHandler);

      expect(function() {
        player.play();
      }).not.toThrow();
    });
  });

  describe('with fallbackToMutedAutoplay options', function() {
    it('falls back to muted play when option is present', function() {
      var player = fakePlayer();
      player.originalPlay.onFirstCall().returns(rejectedAutoplayPromise());
      player.originalPlay.onSecondCall().returns(Promise.resolve());

      handleFailedPlay(player, {
        hasAutoplaySupport: true,
        fallbackToMutedAutoplay: true
      });

      return player.play().then(function() {
        expect(player.muted).toHaveBeenCalled();
        expect(player.originalPlay).toHaveBeenCalledTwice();
      });
    });

    it('trigers playmuted event', function() {
      var player = fakePlayer();
      player.originalPlay.onFirstCall().returns(rejectedAutoplayPromise());
      player.originalPlay.onSecondCall().returns(Promise.resolve());
      var playmutedHandler = sinon.spy();

      handleFailedPlay(player, {
        hasAutoplaySupport: true,
        fallbackToMutedAutoplay: true
      });
      player.on('playmuted', playmutedHandler);

      return player.play().then(function() {
        expect(playmutedHandler).toHaveBeenCalled();
      });
    });

    it('does not triger playfailed event', function() {
      var player = fakePlayer();
      player.originalPlay.onFirstCall().returns(rejectedAutoplayPromise());
      player.originalPlay.onSecondCall().returns(Promise.resolve());
      var playfailedHandler = sinon.spy();

      handleFailedPlay(player, {
        hasAutoplaySupport: true,
        fallbackToMutedAutoplay: true
      });
      player.on('playfailed', playfailedHandler);

      return player.play().then(function() {
        expect(playfailedHandler).not.toHaveBeenCalled();
      });
    });

    it('trigers playfailed event when muted play fails', function() {
      var player = fakePlayer();
      player.originalPlay.onFirstCall().returns(rejectedAutoplayPromise());
      player.originalPlay.onSecondCall().returns(rejectedAutoplayPromise());
      var playfailedHandler = sinon.spy();

      handleFailedPlay(player, {
        hasAutoplaySupport: true,
        fallbackToMutedAutoplay: true
      });
      player.on('playfailed', playfailedHandler);

      return player.play().then(function() {
        expect(playfailedHandler).toHaveBeenCalled();
      });
    });
  });

  function rejectedAutoplayPromise() {
    return Promise.reject({name: 'NotAllowedError'});
  }

  function fakePlayer(options) {
    var originalPlay = sinon.stub();

    return _.extend({
      originalPlay: originalPlay,
      play: originalPlay,

      muted: sinon.spy()
    }, BackboneEvents);
  }
});
