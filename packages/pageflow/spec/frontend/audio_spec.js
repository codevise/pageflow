import '$pageflow/frontend';

import sinon from 'sinon';

describe('pageflow.Audio', function() {
  var p = pageflow;

  describe('#createPlayer', function() {
    it('calls getSources with audio file id', function() {
      var getSources = sinon.stub().returns(null);
      var audio = new p.Audio({getSources: getSources});

      audio.createPlayer(5);

      expect(getSources).to.have.been.calledWith(5);
    });

    it('removes suffix from audio file id', function() {
      var getSources = sinon.stub().returns(null);
      var audio = new p.Audio({getSources: getSources});

      audio.createPlayer('5.suffix');

      expect(getSources).to.have.been.calledWith(5);
    });

    it('passes null id to getSources', function() {
      var getSources = sinon.stub().returns(null);
      var audio = new p.Audio({getSources: getSources});

      audio.createPlayer(null);

      expect(getSources).to.have.been.calledWith(null);
    });
  });
});