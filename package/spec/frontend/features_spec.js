import {Features} from 'pageflow/frontend';

import sinon from 'sinon';

describe('pageflow.Features', function() {

  describe('#enable', function() {
    it('calls functions registered for one of the given features in this scope', function() {
      var features = new Features();
      var fn = sinon.spy();

      features.register('editor', 'atmo', fn);
      features.enable('editor', ['atmo']);

      expect(fn).toHaveBeenCalled();
    });

    it('does not call functions registered for other scope', function() {
      var features = new Features();
      var fn = sinon.spy();

      features.register('slideshow', 'atmo', fn);
      features.enable('editor', ['atmo']);

      expect(fn).not.toHaveBeenCalled();
    });

    it('does not call functions for non-enabled features', function() {
      var features = new Features();
      var fn = sinon.spy();

      features.register('editor', 'atmo', fn);
      features.enable('editor', ['other']);

      expect(fn).not.toHaveBeenCalled();
    });

    it('marks features as enabled', function() {
      var features = new Features();

      features.enable('editor', ['atmo']);

      expect(features.isEnabled('atmo')).toBe(true);
      expect(features.isEnabled('other')).toBe(false);
    });
  });
});