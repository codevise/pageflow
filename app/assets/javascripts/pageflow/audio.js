//= require_self
//= require ./audio/player_pool
//= require ./audio/multi_player

pageflow.Audio = function(options) {
  this.getSources = options.getSources || function(audioFileId) {
    return options.audioFiles[audioFileId] || '';
  };

  this.createPlayer = function(audioFileId, options) {
    var sources = this.getSources(audioFileId);

    if (sources) {
      return new pageflow.AudioPlayer(sources, options);
    }
    else {
      return new pageflow.AudioPlayer.Null();
    }
  };

  this.createMultiPlayer = function(options) {
    return new pageflow.Audio.MultiPlayer(
      new pageflow.Audio.PlayerPool(this, options),
      options
    );
  };
};

pageflow.Audio.setup = function(options) {
  pageflow.audio = new pageflow.Audio(options);
};