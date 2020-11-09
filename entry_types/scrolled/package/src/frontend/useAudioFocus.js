import React, {createContext, useContext, useEffect, useMemo, useState} from 'react';
import {usePrevious} from './usePrevious';

const AudioFocusContext = createContext();

export function AudioFocusProvider({children}) {
  const [currentKey, setCurrentKey] = useState([]);
  const value = useMemo(() => [currentKey, setCurrentKey], [currentKey, setCurrentKey]);

  return (
    <AudioFocusContext.Provider value={value}>
      {children}
    </AudioFocusContext.Provider>
  );
}

/**
 * Prevent parallel playback of multiple media elements.
 *
 * @param {Object} options
 * @param {number} options.key - Unique id used to identify the element.
 * @param {boolean} options.request - Set to true to request audio focus.
 * @param {Function} options.onLost -
 *   Callback that will be invoked if another element requests audio
 *   focus, thereby preempting your hold of audio focus. The callback
 *   should pause the element.
 */
export function useAudioFocus({key, request, onLost}) {
  const wasRequested = usePrevious(request);
  const [currentKey, setCurrentKey] = useContext(AudioFocusContext);
  const previousKey = usePrevious(currentKey);

  useEffect(() => {
    if (request && !wasRequested) {
      setCurrentKey(key);
    }
  }, [request, wasRequested, setCurrentKey, key]);

  useEffect(() => {
    if (previousKey === key && currentKey !== key) {
      onLost();
    }
  }, [currentKey, previousKey, key, onLost]);
}
