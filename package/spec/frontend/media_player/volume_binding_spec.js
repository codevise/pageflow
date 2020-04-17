import jQuery from 'jquery';
import Backbone from 'backbone';

import {mediaPlayer}  from 'pageflow/frontend';

import sinon from 'sinon';

describe('volumeBinding', function() {
  var volumeBinding = mediaPlayer.volumeBinding;
  var asyncPlay = mediaPlayer.asyncPlay;
  describe('#play', function() {
    it('sets volume to settings volume', function() {
      var player = fakePlayer();
      var settings = new Backbone.Model({volume: 98});
      volumeBinding(player, settings);

      player.play();

      expect(player.currentVolume).toBe(98);
    });

    it('starts listenting to settings changes', function() {
      var player = fakePlayer();
      var settings = new Backbone.Model({volume: 98});
      volumeBinding(player, settings);

      player.play();
      settings.set('volume', 50);

      expect(player.fadingVolume).toBe(50);
    });

    it('calls original play method', function() {
      var player = fakePlayer();
      var settings = new Backbone.Model({volume: 98});
      volumeBinding(player, settings);

      player.play();

      expect(player.originalPlay).toHaveBeenCalled();
    });

    it('aborts intent to pause', function() {
      var player = fakePlayer({playing: true});
      var settings = new Backbone.Model({volume: 98});
      volumeBinding(player, settings);

      player.intendToPause();
      player.play();

      expect(player.intendingToPause()).toBe(false);
    });

    describe('with volumeFactor option', function() {
      it('sets volume to multiplied settings volume', function() {
        var player = fakePlayer();
        var settings = new Backbone.Model({volume: 100});
        volumeBinding(player, settings, {volumeFactor: 0.5});

        player.play();

        expect(player.currentVolume).toBe(50);
      });
    });
  });

  describe('#playAndFadeIn', function() {
    it('fades from 0 to settings volume', function() {
      var player = fakePlayer();
      var settings = new Backbone.Model({volume: 98});
      volumeBinding(player, settings);

      player.playAndFadeIn(500);

      expect(player.currentVolume).toBe(0);
      expect(player.fadingVolume).toBe(98);
      expect(player.fadingDuration).toBe(500);
    });

    it('starts listenting to settings changes', function() {
      var player = fakePlayer();
      var settings = new Backbone.Model({volume: 98});
      volumeBinding(player, settings);

      player.playAndFadeIn(500);
      settings.set('volume', 50);

      expect(player.fadingVolume).toBe(50);
    });

    it('does not fade in until promise returned by play is resolved', function() {
      var player = fakePlayer();
      var settings = new Backbone.Model({volume: 98});
      var deferred = new jQuery.Deferred();
      player.play = function() { return deferred.promise(); };
      volumeBinding(player, settings);

      player.playAndFadeIn(500);

      expect(player.fadingVolume).toBe(undefined);
    });

    it('fades in after promise returned by play is resolved', function() {
      var player = fakePlayer();
      var settings = new Backbone.Model({volume: 98});
      var deferred = new jQuery.Deferred();
      player.play = function() { return deferred.promise(); };
      volumeBinding(player, settings);

      player.playAndFadeIn(500);
      deferred.resolve();

      expect(player.fadingVolume).toBe(98);
    });

    it('returns promise which resolves after fade', function() {
      var player = fakePlayer();
      var settings = new Backbone.Model({volume: 98});
      var callback = sinon.spy();
      volumeBinding(player, settings);

      player.playAndFadeIn(500).then(callback);
      player.fadingDeferred.resolve();

      expect(callback).toHaveBeenCalled();
    });

    it('returns promise which resolves even if fade is canceled', function() {
      var player = fakePlayer();
      var settings = new Backbone.Model({volume: 98});
      var callback = sinon.spy();
      volumeBinding(player, settings);

      player.playAndFadeIn(500).then(callback);
      player.fadingDeferred.reject();

      expect(callback).toHaveBeenCalled();
    });

    it('calls original play method', function() {
      var player = fakePlayer();
      var settings = new Backbone.Model({volume: 98});
      volumeBinding(player, settings);

      player.playAndFadeIn();

      expect(player.originalPlay).toHaveBeenCalled();
    });

    it('aborts intent to pause', function() {
      var player = fakePlayer({playing: true});
      var settings = new Backbone.Model({volume: 98});
      volumeBinding(player, settings);

      player.intendToPause();
      player.playAndFadeIn(500);

      expect(player.intendingToPause()).toBe(false);
    });

    it('returns resolved promise if alreay playing', function() {
      var player = fakePlayer({playing: true});
      var settings = new Backbone.Model({volume: 98});
      var callback = sinon.spy();
      volumeBinding(player, settings);

      player.playAndFadeIn(500).then(callback);

      expect(callback).toHaveBeenCalled();
    });

    describe('with volumeFactor option', function() {
      it('fades to multiplied settings volume', function() {
        var player = fakePlayer();
        var settings = new Backbone.Model({volume: 100});
        volumeBinding(player, settings, {volumeFactor: 0.5});

        player.playAndFadeIn(500);

        expect(player.currentVolume).toBe(0);
        expect(player.fadingVolume).toBe(50);
        expect(player.fadingDuration).toBe(500);
      });

      it('uses multiplied volume on settings change', function() {
        var player = fakePlayer();
        var settings = new Backbone.Model({volume: 100});
        volumeBinding(player, settings, {volumeFactor: 0.5});

        player.playAndFadeIn(500);
        settings.set('volume', 80);

        expect(player.fadingVolume).toBe(40);
      });
    });
  });

  describe('#pause', function() {
    it('stops listenting to settings changes', function() {
      var player = fakePlayer();
      var settings = new Backbone.Model({volume: 98});
      volumeBinding(player, settings);

      player.play();
      player.pause();
      settings.set('volume', 50);

      expect(player.fadingVolume).toBe(undefined);
    });

    it('calls original play method', function() {
      var player = fakePlayer();
      var settings = new Backbone.Model();
      volumeBinding(player, settings);

      player.pause();

      expect(player.originalPause).toHaveBeenCalled();
    });

    it('aborts intent to play', function() {
      var player = fakePlayer();
      var settings = new Backbone.Model({volume: 98});
      volumeBinding(player, settings);

      player.intendToPlay();
      player.pause();

      expect(player.intendingToPlay()).toBe(false);
    });
  });

  describe('#fadeOutAndPause', function() {
    it('fades to 0', function() {
      var player = fakePlayer({playing: true});
      var settings = new Backbone.Model({volume: 98});
      volumeBinding(player, settings);

      player.fadeOutAndPause(500);

      expect(player.fadingVolume).toBe(0);
      expect(player.fadingDuration).toBe(500);
    });

    it('stops listenting to settings changes', function() {
      var player = fakePlayer({playing: true});
      var settings = new Backbone.Model({volume: 98});
      volumeBinding(player, settings);

      player.play();
      player.fadeOutAndPause(500);
      settings.set('volume', 50);

      expect(player.fadingVolume).toBe(0);
    });

    it('calls original pause when fading promise resolves', function() {
      var player = fakePlayer({playing: true});
      var settings = new Backbone.Model({volume: 98});
      volumeBinding(player, settings);

      player.fadeOutAndPause(500);

      expect(player.originalPause).not.toHaveBeenCalled();
      player.fadingDeferred.resolve();
      expect(player.originalPause).toHaveBeenCalled();
    });

    it('calls original pause even when fade is canceled', function() {
      var player = fakePlayer({playing: true});
      var settings = new Backbone.Model({volume: 98});
      volumeBinding(player, settings);

      player.fadeOutAndPause(500);

      player.fadingDeferred.reject();
      expect(player.originalPause).toHaveBeenCalled();
    });

    it('does not calls original pause when played during fade out', function() {
      var player = fakePlayer({playing: true});
      var settings = new Backbone.Model({volume: 98});
      volumeBinding(player, settings);

      player.fadeOutAndPause(500);
      player.play();
      player.fadingDeferred.resolve();

      expect(player.originalPause).not.toHaveBeenCalled();
    });

    it('aborts intent to play', function() {
      var player = fakePlayer();
      var settings = new Backbone.Model({volume: 98});
      volumeBinding(player, settings);

      player.intendToPlay();
      player.fadeOutAndPause(500);

      expect(player.intendingToPlay()).toBe(false);
    });

    it('returns fadeVolume promise', function() {
      var player = fakePlayer({playing: true});
      var settings = new Backbone.Model({volume: 98});
      volumeBinding(player, settings);
      var callback = sinon.spy();

      player.fadeOutAndPause(500).then(callback);

      player.fadingDeferred.resolve();
      expect(callback).toHaveBeenCalled();
    });

    it('returns resolved promise if not playing', function() {
      var player = fakePlayer({playing: false});
      var settings = new Backbone.Model({volume: 98});
      volumeBinding(player, settings);
      var callback = sinon.spy();

      player.fadeOutAndPause(500).then(callback);

      expect(callback).toHaveBeenCalled();
    });
  });

  describe('#changeVolumeFactor', function() {
    it('fades to new multiplied volume', function() {
      var player = fakePlayer();
      var settings = new Backbone.Model({volume: 100});
      volumeBinding(player, settings, {volumeFactor: 1});

      player.changeVolumeFactor(0.5, 500);

      expect(player.currentVolume).toBe(100);
      expect(player.fadingVolume).toBe(50);
      expect(player.fadingDuration).toBe(500);
    });

    it('returns fadeVolume promise', function() {
      var player = fakePlayer({playing: true});
      var settings = new Backbone.Model({volume: 98});
      volumeBinding(player, settings);
      var callback = sinon.spy();

      player.changeVolumeFactor(0.5, 500).then(callback);

      player.fadingDeferred.resolve();
      expect(callback).toHaveBeenCalled();
    });
  });

  function fakePlayer(options) {
    options = options || {};

    var playSpy = sinon.spy();
    var pauseSpy = sinon.spy();

    var player = {
      currentVolume: 100,

      play: playSpy,
      originalPlay: playSpy,

      pause: pauseSpy,
      originalPause: pauseSpy,

      paused: function() {
        return !options.playing;
      },

      volume: function(value) {
        this.currentVolume = value;
      },

      fadeVolume: function(value, duration) {
        this.fadingVolume = value;
        this.fadingDuration = duration;
        this.fadingDeferred = new jQuery.Deferred();

        return this.fadingDeferred.promise();
      },

      on: function() {},
      one: function() {},
      off: function() {}
    };

    asyncPlay(player);

    return player;
  }
});
