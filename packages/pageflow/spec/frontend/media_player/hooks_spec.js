import jQuery from 'jquery';
import Backbone from 'backbone';

import _ from 'underscore';

import '$pageflow/frontend';

import sinon from 'sinon';

describe('pageflow.mediaPlayer.hooks', function() {
  describe('#play', function() {
    describe('without before option', function() {
      it('calls orginal play method', function() {
        var player = fakePlayer();
        pageflow.mediaPlayer.hooks(player, {});

        player.play();

        expect(player.originalPlay).toHaveBeenCalled();
      });
    });

    describe('with before option', function() {
      it('calls passed function', function() {
        var player = fakePlayer();
        var beforeCallback = sinon.spy();
        pageflow.mediaPlayer.hooks(player, {
          before: beforeCallback
        });

        player.play();

        expect(beforeCallback).toHaveBeenCalled();
      });

      it('emits beforeplay event', function() {
        var player = fakePlayer();
        var eventHandler = sinon.spy();
        pageflow.mediaPlayer.hooks(player, {
          before: function() {}
        });

        player.on('beforeplay', eventHandler);
        player.play();

        expect(eventHandler).toHaveBeenCalled();
      });

      it('aborts intent to pause', function() {
        var player = fakePlayer();
        var deferred = new jQuery.Deferred();
        pageflow.mediaPlayer.hooks(player, {
          before: function() {
            return deferred.promise();
          }
        });

        player.intendToPause();
        player.play();

        expect(player.intendingToPause()).toBe(false);
      });

      it('calls original play method when promise returned by before is resolved', function() {
        var player = fakePlayer();
        var deferred = new jQuery.Deferred();
        pageflow.mediaPlayer.hooks(player, {
          before: function() {
            return deferred.promise();
          }
        });

        player.play();
        deferred.resolve();

        expect(player.originalPlay).toHaveBeenCalled();
      });

      it('does not call original play method until promise returned by before is resolved', function() {
        var player = fakePlayer();
        var deferred = new jQuery.Deferred();
        pageflow.mediaPlayer.hooks(player, {
          before: function() {
            return deferred.promise();
          }
        });

        player.play();

        expect(player.originalPlay).not.toHaveBeenCalled();
      });

      it('calls original play method if before does not return promise', function() {
        var player = fakePlayer();
        pageflow.mediaPlayer.hooks(player, {
          before: function() {}
        });

        player.play();

        expect(player.originalPlay).toHaveBeenCalled();
      });

      it('does not call original play method if player is paused before promise returned by before is resolved', function() {
        var player = fakePlayer();
        var deferred = new jQuery.Deferred();
        pageflow.mediaPlayer.hooks(player, {
          before: function() {
            return deferred.promise();
          }
        });

        player.play();
        player.pause();
        deferred.resolve();

        expect(player.originalPlay).not.toHaveBeenCalled();
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
    }, Backbone.Events);

    pageflow.mediaPlayer.asyncPlay(player);

    return player;
  }
});
