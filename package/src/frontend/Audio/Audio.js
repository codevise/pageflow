import {AudioPlayer} from '../AudioPlayer';
import {MultiPlayer} from '../media';
import {PlayerPool} from './PlayerPool';
import {state} from '../state';

/**
 * Playing audio files.
 * @alias pageflow.audio
 * @member
 */
export const Audio = function(options) {
  this.getSources = options.getSources || function(audioFileId) {
    return options.audioFiles[audioFileId] || '';
  };

  /**
   * Creates a player for the given audio file.
   *
   * @param {string|number} audioFileId
   *   Id of the audio file to play. The id can be of the form
   *   `"5.suffix"` to distinguish multiple occurences of the same
   *   audio file for example inside a pageflow.Audio.PlayerPool;
   *
   * @param {Object} [options]
   *   Options to pass on player creation
   *
   * @static
   */
  this.createPlayer = function(audioFileId, options) {
    var sources = this.getSources(removeSuffix(audioFileId));

    if (sources) {
      return new AudioPlayer(sources, {
        volumeFading: true ,
        ...options
      });
    }
    else {
      return new AudioPlayer.Null();
    }
  };

  /**
   * Create a `MultiPlayer` to play and fade between multiple audio
   * files.
   *
   * @param {Object} [options]
   *   All options supported by pageflow.AudioPlayer can be passed.
   *
   * @param {number} [options.fadeDuration]
   *   Time in milliseconds to fade audios in and out.
   *
   * @param {boolean} [options.playFromBeginning=false]
   *   Always restart audio files from the beginning.
   *
   * @param {boolean} [options.rewindOnChange=false]
   *   Play from beginning when changing audio files.
   *
   * @return {pageflow.Audio.MultiPlayer}
   */
  this.createMultiPlayer = function(options) {
    return new MultiPlayer(
      new PlayerPool(this, options),
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

Audio.setup = function(options) {
  state.audio = new Audio(options);
};
