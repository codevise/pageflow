describe('pageflow.Audio.MultiPlayer', function() {
  describe('#fadeTo', function() {
    it('plays and fades in new player', function() {
      var player = new pageflow.AudioPlayer.Null();
      var pool = fakePlayerPool({5: player});
      var poolPlayer = new pageflow.Audio.MultiPlayer(pool, {fadeDuration: 1000});

      sinon.spy(player, 'playAndFadeIn');

      poolPlayer.fadeTo(5);

      expect(player.playAndFadeIn).to.have.been.calledWith(1000);
    });

    it('fades and pauses previous player', function() {
      var previousPlayer = new pageflow.AudioPlayer.Null();
      var pool = fakePlayerPool({
        5: previousPlayer,
        6: new pageflow.AudioPlayer.Null()
      });
      var poolPlayer = new pageflow.Audio.MultiPlayer(pool, {fadeDuration: 1000});

      sinon.spy(previousPlayer, 'fadeOutAndPause');

      poolPlayer.fadeTo(5);
      poolPlayer.fadeTo(6);

      expect(previousPlayer.fadeOutAndPause).to.have.been.calledWith(1000);
    });
  });

  describe('#play', function() {
    it('plays new player', function() {
      var player = new pageflow.AudioPlayer.Null();
      var pool = fakePlayerPool({5: player});
      var poolPlayer = new pageflow.Audio.MultiPlayer(pool, {fadeDuration: 1000});

      sinon.spy(player, 'play');

      poolPlayer.play(5);

      expect(player.play).to.have.been.called;
    });

    it('fades and pauses previous player', function() {
      var previousPlayer = new pageflow.AudioPlayer.Null();
      var pool = fakePlayerPool({
        5: previousPlayer,
        6: new pageflow.AudioPlayer.Null()
      });
      var poolPlayer = new pageflow.Audio.MultiPlayer(pool, {fadeDuration: 1000});

      sinon.spy(previousPlayer, 'fadeOutAndPause');

      poolPlayer.play(5);
      poolPlayer.play(6);

      expect(previousPlayer.fadeOutAndPause).to.have.been.calledWith(1000);
    });
  });

  it('emits play event on play', function() {
    var player = new pageflow.AudioPlayer.Null();
    var pool = fakePlayerPool({5: player});
    var poolPlayer = new pageflow.Audio.MultiPlayer(pool, {fadeDuration: 1000});
    var handler = sinon.spy();

    poolPlayer.on('play', handler);
    poolPlayer.play(5);
    player.trigger('play');

    expect(handler).to.have.been.calledWith({audioFileId: 5});
  });

  it('emits ended event when player ends', function() {
    var player = new pageflow.AudioPlayer.Null();
    var pool = fakePlayerPool({5: player});
    var poolPlayer = new pageflow.Audio.MultiPlayer(pool, {fadeDuration: 1000});
    var handler = sinon.spy();

    poolPlayer.on('ended', handler);
    poolPlayer.play(5);
    player.trigger('ended');

    expect(handler).to.have.been.calledWith({audioFileId: 5});
  });

  it('does not emit ended event if player is no longer current player', function() {
    var player = new pageflow.AudioPlayer.Null();
    var pool = fakePlayerPool({
      5: player,
      6: new pageflow.AudioPlayer.Null()
    });
    var poolPlayer = new pageflow.Audio.MultiPlayer(pool, {fadeDuration: 1000});
    var handler = sinon.spy();

    poolPlayer.on('ended', handler);
    poolPlayer.play(5);
    poolPlayer.play(6);
    player.trigger('ended');

    expect(handler).not.to.have.been.called;
  });

  function fakePlayerPool(players) {
    return {
      get: function(id) {
        return players[id];
      }
    };
  }
});