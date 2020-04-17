import {Audio} from 'pageflow/frontend';

import sinon from 'sinon';

describe('pageflow.Audio', function() {

  describe('#createPlayer', function() {
    it('calls getSources with audio file id', function() {
      var getSources = sinon.stub().returns(null);
      var audio = new Audio({getSources: getSources});

      audio.createPlayer(5);

      expect(getSources).toHaveBeenCalledWith(5);
    });

    it('removes suffix from audio file id', function() {
      var getSources = sinon.stub().returns(null);
      var audio = new Audio({getSources: getSources});

      audio.createPlayer('5.suffix');

      expect(getSources).toHaveBeenCalledWith(5);
    });

    it('passes null id to getSources', function() {
      var getSources = sinon.stub().returns(null);
      var audio = new Audio({getSources: getSources});

      audio.createPlayer(null);

      expect(getSources).toHaveBeenCalledWith(null);
    });
  });
});