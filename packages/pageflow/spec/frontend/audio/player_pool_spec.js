describe('pageflow.Audio.PlayerPool', function() {
  describe('#get', function() {
    it('creates player for new audio file id', function() {
      var audio = {createPlayer: sinon.stub()};
      var pool = new pageflow.Audio.PlayerPool(audio);
      var player = {};
      var audioFileId = 5;

      audio.createPlayer.returns(player);

      var result = pool.get(audioFileId);

      expect(result).to.eq(player);
    });

    it('passes options when creating player', function() {
      var audio = {createPlayer: sinon.stub()};
      var options = {};
      var pool = new pageflow.Audio.PlayerPool(audio, options);
      var player = {};
      var audioFileId = 5;

      audio.createPlayer.returns(player);

      pool.get(audioFileId);

      expect(audio.createPlayer).to.have.been.calledWith(audioFileId, options);
    });

    it('caches player for audio file id', function() {
      var audio = {createPlayer: sinon.stub()};
      var pool = new pageflow.Audio.PlayerPool(audio);
      var player = {};
      var audioFileId = 5;

      audio.createPlayer.returns(player);

      pool.get(audioFileId);
      var result = pool.get(audioFileId);

      expect(result).to.eq(player);
      expect(audio.createPlayer).to.have.been.calledOnce;
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

      expect(audio.createPlayer).to.have.been.calledTwice;
    });
  });
});