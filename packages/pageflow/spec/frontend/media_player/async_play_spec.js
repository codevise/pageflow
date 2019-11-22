describe('pageflow.mediaPlayer.asyncPlay', function() {
  describe('#play', function() {
    it('sets intendingToPlay to true', function() {
      var player = fakePlayer();
      pageflow.mediaPlayer.asyncPlay(player);

      player.play();

      expect(player.intendingToPlay()).to.eq(true);
    });

    it('sets intendingToPause to false', function() {
      var player = fakePlayer();
      pageflow.mediaPlayer.asyncPlay(player);

      player.play();

      expect(player.intendingToPause()).to.eq(false);
    });
  });

  describe('#pause', function() {
    it('sets intendingToPause to true', function() {
      var player = fakePlayer();
      pageflow.mediaPlayer.asyncPlay(player);

      player.pause();

      expect(player.intendingToPause()).to.eq(true);
    });

    it('sets intendingToPlay to false', function() {
      var player = fakePlayer();
      pageflow.mediaPlayer.asyncPlay(player);

      player.pause();

      expect(player.intendingToPlay()).to.eq(false);
    });
  });

  describe('#ifIntendingToPlay', function() {
    it('resolves if intending to play', function() {
      var player = fakePlayer();
      pageflow.mediaPlayer.asyncPlay(player);
      var handler = sinon.spy();

      player.intendToPlay();
      player.ifIntendingToPlay().then(handler);

      expect(handler).to.have.been.called;
    });

    it('rejects if not intending to play', function() {
      var player = fakePlayer();
      pageflow.mediaPlayer.asyncPlay(player);
      var handler = sinon.spy();

      player.ifIntendingToPlay().fail(handler);

      expect(handler).to.have.been.called;
    });
  });

  describe('#ifIntendingToPause', function() {
    it('resolves if intending to pause', function() {
      var player = fakePlayer();
      pageflow.mediaPlayer.asyncPlay(player);
      var handler = sinon.spy();

      player.intendToPause();
      player.ifIntendingToPause().then(handler);

      expect(handler).to.have.been.called;
    });

    it('rejects if not intending to pause', function() {
      var player = fakePlayer();
      pageflow.mediaPlayer.asyncPlay(player);
      var handler = sinon.spy();

      player.ifIntendingToPause().fail(handler);

      expect(handler).to.have.been.called;
    });
  });

  function fakePlayer() {
    return {
      play: sinon.spy(),
      pause: sinon.spy()
    };
  }
});