import '$pageflow/frontend';

import sinon from 'sinon';

describe('pageflow.Audio.PlayerPool', function() {
  describe('#get', function() {
    it('creates player for new audio file id', function() {
      var audio = {createPlayer: sinon.stub()};
      var pool = new pageflow.Audio.PlayerPool(audio);
      var player = {};
      var audioFileId = 5;

      audio.createPlayer.returns(player);

      var result = pool.get(audioFileId);

      expect(result).toBe(player);
    });

    it('passes options when creating player', function() {
      var audio = {createPlayer: sinon.stub()};
      var options = {};
      var pool = new pageflow.Audio.PlayerPool(audio, options);
      var player = {};
      var audioFileId = 5;

      audio.createPlayer.returns(player);

      pool.get(audioFileId);

      expect(audio.createPlayer).toHaveBeenCalledWith(audioFileId, options);
    });

    it('caches player for audio file id', function() {
      var audio = {createPlayer: sinon.stub()};
      var pool = new pageflow.Audio.PlayerPool(audio);
      var player = {};
      var audioFileId = 5;

      audio.createPlayer.returns(player);

      pool.get(audioFileId);
      var result = pool.get(audioFileId);

      expect(result).toBe(player);
      expect(audio.createPlayer).toHaveBeenCalledOnce();
    });

    it('recreates players after dispose', function() {
      var audio = {createPlayer: sinon.stub()};
      var pool = new pageflow.Audio.PlayerPool(audio);
      var player = {};
      var audioFileId = 5;

      audio.createPlayer.returns(player);

      pool.get(audioFileId);
      pool.dispose();
      pool.get(audioFileId);

      expect(audio.createPlayer).toHaveBeenCalledTwice();
    });
  });
});