import BackboneEvents from 'backbone-events-standalone';

import _ from 'underscore';

import {mediaPlayer} from 'pageflow/frontend';

import sinon from 'sinon';

describe('hooks', function() {
  var hooks = mediaPlayer.hooks;
  var asyncPlay = mediaPlayer.asyncPlay;

  describe('#play', function() {
    describe('without before option', function() {
      it('calls orginal play method', async () => {
        var player = fakePlayer();
        hooks(player, {});

        await player.play();

        expect(player.originalPlay).toHaveBeenCalled();
      });
    });

    describe('with before option', function() {
      it('calls passed function', async () => {
        var player = fakePlayer();
        var beforeCallback = sinon.spy();
        hooks(player, {
          before: beforeCallback
        });

        await player.play();

        expect(beforeCallback).toHaveBeenCalled();
      });

      it('emits beforeplay event', async () => {
        var player = fakePlayer();
        var eventHandler = sinon.spy();
        hooks(player, {
          before: function() {}
        });

        player.on('beforeplay', eventHandler);
        await player.play();

        expect(eventHandler).toHaveBeenCalled();
      });

      it('aborts intent to pause', async () => {
        var player = fakePlayer();
        hooks(player, {
          before: function() {
            return Promise.resolve();
          }
        });

        player.intendToPause();
        await player.play();

        expect(player.intendingToPause()).toBe(false);
      });

      it('calls original play method when promise returned by before is resolved', async () => {
        var player = fakePlayer();

        var promiseResolve;
        var promise = new Promise(function(resolve, reject) {
          promiseResolve = resolve;
        });

        hooks(player, {
          before: function() {
            return promise;
          }
        });

        const playPromise = player.play();
        promiseResolve();
        await playPromise;

        expect(player.originalPlay).toHaveBeenCalled();
      });

      it('does not call original play method when promise returned by before is rejected', async () => {
        var player = fakePlayer();

        var promiseReject;
        var promise = new Promise(function(resolve, reject) {
          promiseReject = reject;
        });

        hooks(player, {
          before: function() {
            return promise;
          }
        });

        const playPromise = player.play();
        promiseReject();

        await expect(playPromise).rejects.toBeUndefined();
        expect(player.originalPlay).not.toHaveBeenCalled();
      });

      it('calls original play method if before does not return promise', async () => {
        var player = fakePlayer();
        hooks(player, {
          before: function() {}
        });

        await player.play();

        expect(player.originalPlay).toHaveBeenCalled();
      });

      it('does not call original play method if player is paused before promise returned by before is resolved', async () => {
        var player = fakePlayer();

        var promiseResolve;
        var promise = new Promise(function(resolve, reject) {
          promiseResolve = resolve;
        });

        hooks(player, {
          before: function() {
            return promise;
          }
        });

        const playPromise = player.play();
        player.pause();
        promiseResolve();

        await expect(playPromise).rejects.toBe('aborted');
      });
    });
  });

  function fakePlayer() {
    var playSpy = sinon.spy();
    var playAndFadeInSpy = sinon.spy();

    var player = _.extend({
      play: playSpy,
      originalPlay: playSpy,

      playAndFadeIn: playAndFadeInSpy,
      originalPlayAndFadeIn: playAndFadeInSpy,

      pause: sinon.spy()
    }, BackboneEvents);

    asyncPlay(player);

    return player;
  }
});
