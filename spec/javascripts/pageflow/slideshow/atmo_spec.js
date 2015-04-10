describe('pageflow.Slideshow.Atmo', function() {
  describe('on page:change event', function() {
    it('fades to atmo audio file of current page', function() {
      var slideshow = {currentPageConfiguration: sinon.stub()};
      var events = support.fakeEventEmitter();
      var multiPlayer = {fadeTo: sinon.spy()};
      var atmo = new pageflow.Atmo(slideshow, events, multiPlayer);

      slideshow.currentPageConfiguration.returns({
        atmo_audio_file_id: 5
      });

      events.trigger('page:change');

      expect(multiPlayer.fadeTo).to.have.been.calledWith(5);
    });
  });

  describe('on page:update event', function() {
    it('fades to atmo audio file of current page', function() {
      var slideshow = {currentPageConfiguration: sinon.stub()};
      var events = support.fakeEventEmitter();
      var multiPlayer = {fadeTo: sinon.spy()};
      var atmo = new pageflow.Atmo(slideshow, events, multiPlayer);

      slideshow.currentPageConfiguration.returns({
        atmo_audio_file_id: 5
      });

      events.trigger('page:update');

      expect(multiPlayer.fadeTo).to.have.been.calledWith(5);
    });
  });

  describe('#pause', function() {
    it('calls fadeOutAndPause on multiPlayer', function() {
      var slideshow = {};
      var events = support.fakeEventEmitter();
      var multiPlayer = {fadeOutAndPause: sinon.spy()};
      var atmo = new pageflow.Atmo(slideshow, events, multiPlayer);

      atmo.pause();

      expect(multiPlayer.fadeOutAndPause).to.have.been.called;
    });
  });

  describe('#resume', function() {
    describe('when multiPlayer is paused', function() {
      it('calls resumeAndFadeIn on multiPlayer', function() {
        var slideshow = {};
        var events = support.fakeEventEmitter();
        var multiPlayer = {
          paused: sinon.stub().returns(true),
          resumeAndFadeIn: sinon.spy()
        };
        var atmo = new pageflow.Atmo(slideshow, events, multiPlayer);

        atmo.resume();

        expect(multiPlayer.resumeAndFadeIn).to.have.been.called;
      });
    });
  });
});