describe('pageflow.Slideshow.Atmo', function() {
  _.each(['page:change', 'page:update', 'background_media:unmute'], function(event) {
    describe('on ' + event + ' event', function() {
      it('fades to atmo audio file of current page', function() {
        var slideshow = {currentPageConfiguration: sinon.stub()};
        var events = support.fakeEventEmitter();
        var multiPlayer = support.fakeEventEmitter({fadeTo: sinon.spy()});
        buildAtmo({
          slideshow: slideshow,
          events: events,
          multiPlayer: multiPlayer
        });

        slideshow.currentPageConfiguration.returns({
          atmo_audio_file_id: 5
        });

        events.trigger(event);

        expect(multiPlayer.fadeTo).to.have.been.calledWith(5);
      });

      it('does not fade to audio file if atmo is disabled', function() {
        var slideshow = {currentPageConfiguration: sinon.stub()};
        var events = support.fakeEventEmitter();
        var multiPlayer = support.fakeEventEmitter({
          fadeTo: sinon.spy(),
          fadeOutAndPause: sinon.spy()
        });
        var atmo = buildAtmo({
          slideshow: slideshow,
          events: events,
          multiPlayer: multiPlayer
        });

        slideshow.currentPageConfiguration.returns({
          atmo_audio_file_id: 5
        });

        atmo.disable();
        events.trigger(event);

        expect(multiPlayer.fadeTo).not.to.have.been.calledWith(5);
      });

      it('pauses multiPlayer if backgroundMedia is muted', function() {
        var slideshow = {currentPageConfiguration: sinon.stub()};
        var events = support.fakeEventEmitter();
        var multiPlayer = support.fakeEventEmitter({
          fadeTo: sinon.spy(),
          fadeOutAndPause: sinon.spy()
        });
        var backgroundMedia = {muted: true};
        buildAtmo({
          backgroundMedia: backgroundMedia,
          slideshow: slideshow,
          events: events,
          multiPlayer: multiPlayer
        });

        slideshow.currentPageConfiguration.returns({
          atmo_audio_file_id: 5
        });

        events.trigger(event);

        expect(multiPlayer.fadeOutAndPause).to.have.been.called;
      });
    });
  });

  describe('on multiPlayer playfailed event', function() {
    it('mutes background media', function() {
      var backgroundMedia = support.fakeEventEmitter({mute: sinon.spy()});
      var multiPlayer = support.fakeEventEmitter();
      buildAtmo({
        backgroundMedia: backgroundMedia,
        multiPlayer: multiPlayer
      });

      multiPlayer.trigger('playfailed');

      expect(backgroundMedia.mute).to.have.been.called;
    });
  });

  describe('#pause', function() {
    it('calls fadeOutAndPause on multiPlayer', function() {
      var multiPlayer = support.fakeEventEmitter({fadeOutAndPause: sinon.spy()});
      var atmo = buildAtmo({
        multiPlayer: multiPlayer
      });

      atmo.pause();

      expect(multiPlayer.fadeOutAndPause).to.have.been.called;
    });
  });

  describe('#resume', function() {
    describe('when multiPlayer is paused', function() {
      it('calls resumeAndFadeIn on multiPlayer', function() {
        var multiPlayer = support.fakeEventEmitter({
          paused: sinon.stub().returns(true),
          resumeAndFadeIn: sinon.spy()
        });
        var atmo = buildAtmo({
          multiPlayer: multiPlayer
        });

        atmo.resume();

        expect(multiPlayer.resumeAndFadeIn).to.have.been.called;
      });

      it('does not call resumeAndFadeIn on multiPlayer if atmo is disabled', function() {
        var multiPlayer = support.fakeEventEmitter({
          paused: sinon.stub().returns(true),
          resumeAndFadeIn: sinon.spy(),
          fadeOutAndPause: sinon.spy()
        });
        var atmo = buildAtmo({
          multiPlayer: multiPlayer
        });

        atmo.disable();
        atmo.resume();

        expect(multiPlayer.resumeAndFadeIn).not.to.have.been.called;
      });

      it('does not call resumeAndFadeIn on multiPlayer if background media is muted', function() {
        var backgroundMedia = {
          muted: true
        };
        var multiPlayer = support.fakeEventEmitter({
          paused: sinon.stub().returns(true),
          resumeAndFadeIn: sinon.spy(),
          fadeOutAndPause: sinon.spy()
        });
        var atmo = buildAtmo({
          backgroundMedia: backgroundMedia,
          multiPlayer: multiPlayer
        });

        atmo.resume();

        expect(multiPlayer.resumeAndFadeIn).not.to.have.been.called;
      });
    });
  });

  describe('#enable', function() {
    it('fades to atmo audio file of current page', function() {
      var slideshow = {currentPageConfiguration: sinon.stub()};
      var multiPlayer = support.fakeEventEmitter({
        fadeTo: sinon.spy(),
        fadeOutAndPause: sinon.spy()
      });
      var atmo = buildAtmo({
        slideshow: slideshow,
        multiPlayer: multiPlayer
      });

      slideshow.currentPageConfiguration.returns({
        atmo_audio_file_id: 5
      });

      atmo.disable();
      atmo.enable();

      expect(multiPlayer.fadeTo).to.have.been.calledWith(5);
    });
  });

  function buildAtmo(options) {
    return new pageflow.Atmo(_.extend({
      slideshow: {},
      events: support.fakeEventEmitter(),
      backgroundMedia: { mute: sinon.spy(), muted: false }
    }, options));
  }
});
