describe('pageflow.mediaPlayer.hooks', function() {
  describe('#play', function() {
    describe('without before option', function() {
      it('calls orginal play method', function() {
        var player = fakePlayer();
        pageflow.mediaPlayer.hooks(player, {});

        player.play();

        expect(player.originalPlay).to.have.been.called;
      });
    });

    describe('without before option', function() {
      it('calls passed function', function() {
        var player = fakePlayer();
        var beforeCallback = sinon.spy();
        pageflow.mediaPlayer.hooks(player, {
          before: beforeCallback
        });

        player.play();

        expect(beforeCallback).to.have.been.called;
      });

      it('emits beforeplay event', function() {
        var player = fakePlayer();
        var eventHandler = sinon.spy();
        pageflow.mediaPlayer.hooks(player, {
          before: function() {}
        });

        player.on('beforeplay', eventHandler);
        player.play();

        expect(eventHandler).to.have.been.called;
      });

      it('calls original play method when promised returned by before is resolved', function() {
        var player = fakePlayer();
        var deferred = new jQuery.Deferred();
        pageflow.mediaPlayer.hooks(player, {
          before: function() {
            return deferred.promise();
          }
        });

        player.play();
        deferred.resolve();

        expect(player.originalPlay).to.have.been.called;
      });

      it('does not call original play method until promised returned by before is resolved', function() {
        var player = fakePlayer();
        var deferred = new jQuery.Deferred();
        pageflow.mediaPlayer.hooks(player, {
          before: function() {
            return deferred.promise();
          }
        });

        player.play();

        expect(player.originalPlay).not.to.have.been.called;
      });

      it('calls original play method if before does not return promise', function() {
        var player = fakePlayer();
        pageflow.mediaPlayer.hooks(player, {
          before: function() {}
        });

        player.play();

        expect(player.originalPlay).to.have.been.called;
      });
    });
  });

  function fakePlayer() {
    var playSpy = sinon.spy();
    var playAndFadeInSpy = sinon.spy();

    return _.extend({
      play: playSpy,
      originalPlay: playSpy,

      playAndFadeIn: playAndFadeInSpy,
      originalPlayAndFadeIn: playAndFadeInSpy
    }, Backbone.Events);
  }
});