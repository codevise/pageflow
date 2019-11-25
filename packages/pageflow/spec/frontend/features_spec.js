import '$pageflow/frontend';

import sinon from 'sinon';

describe('pageflow.Features', function() {
  var p = pageflow;

  describe('#enable', function() {
    it('calls functions registered for one of the given features in this scope', function() {
      var features = new p.Features();
      var fn = sinon.spy();

      features.register('editor', 'atmo', fn);
      features.enable('editor', ['atmo']);

      expect(fn).to.have.been.called;
    });

    it('does not call functions registered for other scope', function() {
      var features = new p.Features();
      var fn = sinon.spy();

      features.register('slideshow', 'atmo', fn);
      features.enable('editor', ['atmo']);

      expect(fn).not.to.have.been.called;
    });

    it('does not call functions for non-enabled features', function() {
      var features = new p.Features();
      var fn = sinon.spy();

      features.register('editor', 'atmo', fn);
      features.enable('editor', ['other']);

      expect(fn).not.to.have.been.called;
    });

    it('marks features as enabled', function() {
      var features = new p.Features();

      features.enable('editor', ['atmo']);

      expect(features.isEnabled('atmo')).to.eq(true);
      expect(features.isEnabled('other')).to.eq(false);
    });
  });
});