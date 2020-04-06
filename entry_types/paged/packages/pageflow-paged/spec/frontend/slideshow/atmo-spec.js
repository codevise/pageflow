import _ from 'underscore';

import {Atmo} from 'pageflow-paged/frontend';

import '$support/fakeBrowserFeatures';
import * as support from '$support';
import sinon from 'sinon';

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

        expect(multiPlayer.fadeTo).toHaveBeenCalledWith(5);
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

        expect(multiPlayer.fadeTo).not.toHaveBeenCalledWith(5);
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

        expect(multiPlayer.fadeOutAndPause).toHaveBeenCalled();
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

      expect(backgroundMedia.mute).toHaveBeenCalled();
    });
  });

  describe('#pause', function() {
    it('calls fadeOutAndPause on multiPlayer', function() {
      var multiPlayer = support.fakeEventEmitter({fadeOutAndPause: sinon.spy()});
      var atmo = buildAtmo({
        multiPlayer: multiPlayer
      });

      atmo.pause();

      expect(multiPlayer.fadeOutAndPause).toHaveBeenCalled();
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

        expect(multiPlayer.resumeAndFadeIn).toHaveBeenCalled();
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

        expect(multiPlayer.resumeAndFadeIn).not.toHaveBeenCalled();
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

        expect(multiPlayer.resumeAndFadeIn).not.toHaveBeenCalled();
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

      expect(multiPlayer.fadeTo).toHaveBeenCalledWith(5);
    });
  });

  function buildAtmo(options) {
    return new Atmo(_.extend({
      slideshow: {},
      events: support.fakeEventEmitter(),
      backgroundMedia: { mute: sinon.spy(), muted: false }
    }, options));
  }
});
