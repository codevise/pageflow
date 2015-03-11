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
      return new pageflow.AudioPlayer(sources, _.extend({
        volumeFading: true
      }, options || {}));
    }
    else {
      return new pageflow.AudioPlayer.Null();
    }
  };

  /**
   * @option options [Numeric] fadeDuration  Time in milliseconds to fade
   *   audios in and out.
   * @option options [Boolean] playFromBeginning  Do not continue to play
   *   audios at last position. Defaults to false.
   *
   * Furthermore all options supported by pageflow.AudioPlayer can be
   * passed.
   */
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