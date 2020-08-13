import {mediaPlayer, settings}  from 'pageflow/frontend';

import sinon from 'sinon';

describe('volumeBinding', function() {
  var volumeBinding = mediaPlayer.volumeBinding;
  var asyncPlay = mediaPlayer.asyncPlay;
  describe('#play', function() {
    it('sets volume to settings volume', async () => {
      var player = fakePlayer();
      settings.set({volume: 98});
      volumeBinding(player, settings);

      player.play();

      await expect(player.nextVolume).resolves.toBe(98);
    });

    it('starts listenting to settings changes', async () => {
      var player = fakePlayer();
      settings.set({volume: 98});
      volumeBinding(player, settings);

      player.play();
      settings.set('volume', 50);

      await expect(player.nextVolume).resolves.toBe(98);
    });

    it('calls original play method', function() {
      var player = fakePlayer();
      settings.set({volume: 98});
      volumeBinding(player, settings);

      player.play();

      expect(player.originalPlay).toHaveBeenCalled();
    });

    it('aborts intent to pause', function() {
      var player = fakePlayer({playing: true});
      settings.set({volume: 98});
      volumeBinding(player, settings);

      player.intendToPause();
      player.play();

      expect(player.intendingToPause()).toBe(false);
    });

    describe('with volumeFactor option', function() {
      it('sets volume to multiplied settings volume', async () => {
        var player = fakePlayer();
        settings.set({volume: 100});
        volumeBinding(player, settings, {volumeFactor: 0.5});

        player.play();

        await expect(player.nextVolume).resolves.toBe(50);
      });
    });
  });

  describe('#playAndFadeIn', function() {
    it('fades from 0 to settings volume', async () => {
      var player = fakePlayer();
      settings.set({volume: 98});
      volumeBinding(player, settings);

      player.playAndFadeIn(500);

      await expect(player.nextVolume).resolves.toBe(0);
      await expect(player.nextFadeVolume).resolves.toBe(98);
      await expect(player.nextFadeDuration).resolves.toBe(500);
    });

    it('starts listenting to settings changes', async () => {
      var player = fakePlayer();
      settings.set({volume: 98});
      volumeBinding(player, settings);

      player.playAndFadeIn(500);
      settings.set('volume', 50);

      await expect(player.nextFadeVolume).resolves.toBe(50);
    });

    it('does not fade in if promise returned by play is rejected', async () => {
      var player = fakePlayer();
      settings.set({volume: 98});
      player.play = function() { return Promise.reject() };
      volumeBinding(player, settings);

      await player.playAndFadeIn(500).catch(() => {});

      expect(player.fadingVolume).toBe(undefined);
    });

    it('fades in after promise returned by play is resolved', async () => {
      var player = fakePlayer();
      settings.set({volume: 98});
      player.play = function() { return Promise.resolve() };
      volumeBinding(player, settings);

      player.playAndFadeIn(500);

      await expect(player.nextFadeVolume).resolves.toBe(98);
    });

    it('does not fade in when paused while waiting for play promise', async () => {
      const player = fakePlayer({resolveFadingPromiseOnFade: true});
      settings.set({volume: 98});
      const playPromise = resolvablePromise();
      player.play = function() { return playPromise; };
      volumeBinding(player, settings);

      const promise = player.playAndFadeIn(500).catch(() => {});
      player.pause();
      playPromise.resolve();
      await promise;

      expect(player.fadingVolume).toBe(undefined);
    });

    it('returns promise which resolves after fade', async () => {
      var player = fakePlayer();
      settings.set({volume: 98});
      var callback = sinon.spy();
      volumeBinding(player, settings);

      const promise = player.playAndFadeIn(500).then(callback);
      player.fadingPromiseResolve();
      await promise;

      expect(callback).toHaveBeenCalled();
    });

    it('returns promise which resolves even if fade is canceled', async () => {
      var player = fakePlayer();
      settings.set({volume: 98});
      var callback = sinon.spy();
      volumeBinding(player, settings);

      const promise = player.playAndFadeIn(500).then(callback);
      player.fadingPromiseReject();
      await promise;

      expect(callback).toHaveBeenCalled();
    });

    it('calls original play method', function() {
      var player = fakePlayer();
      settings.set({volume: 98});
      volumeBinding(player, settings);

      player.playAndFadeIn();

      expect(player.originalPlay).toHaveBeenCalled();
    });

    it('aborts intent to pause', function() {
      var player = fakePlayer({playing: true});
      settings.set({volume: 98});
      volumeBinding(player, settings);

      player.intendToPause();
      player.playAndFadeIn(500);

      expect(player.intendingToPause()).toBe(false);
    });

    it('returns resolved promise if alreay playing', async () => {
      var player = fakePlayer({playing: true});
      settings.set({volume: 98});
      var callback = sinon.spy();
      volumeBinding(player, settings);

      await player.playAndFadeIn(500).then(callback);

      expect(callback).toHaveBeenCalled();
    });

    describe('with volumeFactor option', function() {
      it('fades to multiplied settings volume', async () => {
        var player = fakePlayer();
        settings.set({volume: 100});
        volumeBinding(player, settings, {volumeFactor: 0.5});

        player.playAndFadeIn(500);

        await expect(player.nextVolume).resolves.toBe(0);
        await expect(player.nextFadeVolume).resolves.toBe(50);
        await expect(player.nextFadeDuration).resolves.toBe(500);
      });

      it('uses multiplied volume on settings change', async () => {
        var player = fakePlayer();
        settings.set({volume: 100});
        volumeBinding(player, settings, {volumeFactor: 0.5});

        player.playAndFadeIn(500);
        settings.set('volume', 80);

        await expect(player.nextFadeVolume).resolves.toBe(40);
      });
    });
  });

  describe('#pause', function() {
    it('stops listenting to settings changes', function() {
      var player = fakePlayer();
      settings.set({volume: 98});
      volumeBinding(player, settings);

      player.play();
      player.pause();
      settings.set('volume', 50);

      expect(player.fadingVolume).toBe(undefined);
    });

    it('calls original play method', function() {
      var player = fakePlayer();
      volumeBinding(player, settings);

      player.pause();

      expect(player.originalPause).toHaveBeenCalled();
    });

    it('aborts intent to play', function() {
      var player = fakePlayer();
      settings.set({volume: 98});
      volumeBinding(player, settings);

      player.intendToPlay();
      player.pause();

      expect(player.intendingToPlay()).toBe(false);
    });
  });

  describe('#fadeOutAndPause', function() {
    it('fades to 0', async () => {
      var player = fakePlayer({playing: true});
      settings.set({volume: 98});
      volumeBinding(player, settings);

      player.fadeOutAndPause(500);

      await expect(player.nextFadeVolume).resolves.toBe(0);
      await expect(player.nextFadeDuration).resolves.toBe(500);
    });

    it('stops listenting to settings changes', function() {
      var player = fakePlayer({playing: true});
      settings.set({volume: 98});
      volumeBinding(player, settings);

      player.play();
      player.fadeOutAndPause(500);
      settings.set('volume', 50);

      expect(player.fadingVolume).toBe(0);
    });

    it('calls original pause when fading promise resolves', async () => {
      var player = fakePlayer({playing: true});
      settings.set({volume: 98});
      volumeBinding(player, settings);

      const promise = player.fadeOutAndPause(500);
      expect(player.originalPause).not.toHaveBeenCalled();
      player.fadingPromiseResolve();
      await promise;
      expect(player.originalPause).toHaveBeenCalled();
    });

    it('does not call original pause when played during fade out', async () => {
      var player = fakePlayer({playing: true});
      settings.set({volume: 98});
      volumeBinding(player, settings);

      const fadingPromise = player.fadeOutAndPause(500);
      player.play();
      player.fadingPromiseResolve();

      await expect(fadingPromise).rejects.toBe('aborted');
      expect(player.originalPause).not.toHaveBeenCalled();
    });

    it('aborts intent to play', async () => {
      var player = fakePlayer();
      settings.set({volume: 98});
      volumeBinding(player, settings);

      player.intendToPlay();
      player.fadeOutAndPause(500);

      expect(player.intendingToPlay()).toBe(false);
    });

    it('returns fadeVolume promise', async () => {
      var player = fakePlayer({playing: true});
      settings.set({volume: 98});
      volumeBinding(player, settings);
      var callback = sinon.spy();

      const promise =  player.fadeOutAndPause(500).then(callback);
      player.fadingPromiseResolve();
      await promise;

      expect(callback).toHaveBeenCalled();
    });

    it('returns resolved promise if not playing', async () => {
      var player = fakePlayer({playing: false});
      settings.set({volume: 98});
      volumeBinding(player, settings);
      var callback = sinon.spy();

      await player.fadeOutAndPause(500).then(callback);

      expect(callback).toHaveBeenCalled();
    });
  });

  describe('#changeVolumeFactor', function() {
    it('fades to new multiplied volume', async () => {
      var player = fakePlayer();
      settings.set({volume: 100});
      volumeBinding(player, settings, {volumeFactor: 1});

      player.changeVolumeFactor(0.5, 500);

      expect(player.currentVolume).toBe(100);
      await expect(player.nextFadeVolume).resolves.toBe(50);
      await expect(player.nextFadeDuration).resolves.toBe(500);
    });

    it('returns fadeVolume promise', async () => {
      var player = fakePlayer({playing: true});
      settings.set({volume: 98});
      volumeBinding(player, settings);
      var callback = sinon.spy();

      const promise = player.changeVolumeFactor(0.5, 500).then(callback);
      player.fadingPromiseResolve();
      await promise;

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

      nextVolume: resolvablePromise(),
      nextFadeVolume: resolvablePromise(),
      nextFadeDuration: resolvablePromise(),

      paused: function() {
        return !options.playing;
      },

      volume: function(value) {
        this.currentVolume = value;
        this.nextVolume.resolve(value);
      },

      fadeVolume: function(value, duration) {
        // sync check
        this.fadingVolume = value;
        this.fadingDuration = duration;

        // async check
        this.nextFadeVolume.resolve(value);
        this.nextFadeDuration.resolve(duration);

        if (options.resolveFadingPromiseOnFade) {
          this.fadingPromiseResolve();
        }

        return this.fadingPromise;
      },

      on: function() {},
      one: function() {},
      off: function() {}
    };

    player.fadingPromise = new Promise(function(resolve, reject) {
      player.fadingPromiseResolve = resolve;
      player.fadingPromiseReject = reject;
    });

    asyncPlay(player);

    return player;
  }
});

function resolvablePromise() {
  let resolve;
  let promise = new Promise(r => resolve = r);
  promise.resolve = resolve;
  return promise;
}
