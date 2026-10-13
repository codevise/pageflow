import React, {createContext, useContext, useEffect, useState} from 'react';
import screenfull from 'screenfull';

const FullscreenStateContext = createContext(false);

export function FullscreenStateProvider({children}) {
  const [isFullscreen, setIsFullscreen] = useState(isDocumentFullscreen);

  useEffect(() => {
    function handleScreenfullChange() {
      setIsFullscreen(screenfull.isFullscreen);
    }

    function handleNativePlayerBegin() {
      setIsFullscreen(true);
    }

    function handleNativePlayerEnd() {
      setIsFullscreen(isDocumentFullscreen());
    }

    if (screenfull.isEnabled) {
      screenfull.on('change', handleScreenfullChange);
    }

    document.addEventListener('webkitbeginfullscreen', handleNativePlayerBegin, true);
    document.addEventListener('webkitendfullscreen', handleNativePlayerEnd, true);

    setIsFullscreen(isDocumentFullscreen());

    return () => {
      if (screenfull.isEnabled) {
        screenfull.off('change', handleScreenfullChange);
      }

      document.removeEventListener('webkitbeginfullscreen', handleNativePlayerBegin, true);
      document.removeEventListener('webkitendfullscreen', handleNativePlayerEnd, true);
    };
  }, []);

  return (
    <FullscreenStateContext.Provider value={isFullscreen}>
      {children}
    </FullscreenStateContext.Provider>
  );
}

export function useIsFullscreen() {
  return useContext(FullscreenStateContext);
}

function isDocumentFullscreen() {
  return screenfull.isEnabled && screenfull.isFullscreen;
}
