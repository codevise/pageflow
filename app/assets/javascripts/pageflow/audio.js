//= require_self
//= require ./audio/player_pool
//= require ./audio/multi_player

pageflow.Audio = function(options) {
  this.getSources = options.getSources || function(audioFileId) {
    return options.audioFiles[audioFileId] || '';
  };

  /**
   * Creates a player for the given audio file.
   *
   * @param [String|Numberic] audioFileId  Id of the audio file to play possibly with a suffix.
   * @param [Object] options  Options to pass on player creation
   *
   * The audio file id can be of the form `"5.suffix"` to distinguish
   * multiple occurences of the same audio file for example inside a
   * pageflow.Audio.PlayerPool;
   */
  this.createPlayer = function(audioFileId, options) {
    var sources = this.getSources(removeSuffix(audioFileId));

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
   * @option options [Boolean] playFromBeginning  Always restart audio
   *   files from the beginning. Defaults to false.
   * @option options [Boolean] rewindOnChange  Play from beginning when
   *   changing audio files. Defaults to false.
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

  function removeSuffix(id) {
    if (!id) {
      return id;
    }

    return parseInt(id.toString().split('.')[0], 10);
  }
};

pageflow.Audio.setup = function(options) {
  pageflow.audio = new pageflow.Audio(options);
};