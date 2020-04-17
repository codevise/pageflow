import {log} from './base';
/**
 * Obtain the globally shared audio context. There can only be a
 * limited number of `AudioContext` objects in one page.
 *
 * @since 12.1
 */
export const audioContext = {
  /**
   * @returns [AudioContext]
   *   Returns `null` if web audio API is not supported or creating
   *   the context fails.
   */
  get: function() {
    var AudioContext = window.AudioContext || window.webkitAudioContext;

    if (typeof this._audioContext === 'undefined') {
      try {
        this._audioContext = AudioContext && new AudioContext();
      }
      catch(e) {
        this._audioContext = null;
        log('Failed to create AudioContext.', {force: true});
      }
    }

    return this._audioContext;
  }
};
