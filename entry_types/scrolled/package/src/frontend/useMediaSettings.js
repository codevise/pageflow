import {useContext} from 'react';
import {MediaContext} from './Media.context';

/**
 * Read and change media settings of the entry.
 *
 * @example
 * const mediaSettings = useMediaSettings();
 * mediaSettings // =>
 *   {
 *      muted: true,            // All media elements should be played without sound.
 *      setMuted: muted => {},  // Enable sound for all media elements.
 *      mediaOff: false         // Playing media is not allowed. Will be true when
 *                              // rendering section thumbnails in the editor.
 *   }
 */
export function useMediaSettings() {
  return useContext(MediaContext);
}
