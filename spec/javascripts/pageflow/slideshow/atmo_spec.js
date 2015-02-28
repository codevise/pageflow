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
    it('calls pause on multiPlayer', function() {
      var slideshow = {};
      var events = support.fakeEventEmitter();
      var multiPlayer = {pause: sinon.spy()};
      var atmo = new pageflow.Atmo(slideshow, events, multiPlayer);

      atmo.pause();

      expect(multiPlayer.pause).to.have.been.called;
    });
  });

  describe('#resume', function() {
    it('calls resume on multiPlayer', function() {
      var slideshow = {};
      var events = support.fakeEventEmitter();
      var multiPlayer = {resume: sinon.spy()};
      var atmo = new pageflow.Atmo(slideshow, events, multiPlayer);

      atmo.resume();

      expect(multiPlayer.resume).to.have.been.called;
    });
  });
});