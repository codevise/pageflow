import React, {createContext, useContext, useState, useEffect} from 'react';
import {media} from 'pageflow/frontend';

import {usePrevious} from './usePrevious';

const MediaMutedContext = createContext(false);

export function MediaMutedProvider({children}) {
  const [value, setValue] = useState(media.muted);

  useEffect(() => {
    media.on('change:muted', setValue);
    return () => media.off('change:muted', setValue);
  }, []);

  return (
    <MediaMutedContext.Provider value={value}>
      {children}
    </MediaMutedContext.Provider>
  )
}

export function useMediaMuted() {
  return useContext(MediaMutedContext);
}

export function useOnUnmuteMedia(callback) {
  const muted = useMediaMuted();
  const wasMuted = usePrevious(muted);

  useEffect(() => {
    if (wasMuted && !muted) {
      callback();
    }
  }, [wasMuted, muted, callback]);
}
