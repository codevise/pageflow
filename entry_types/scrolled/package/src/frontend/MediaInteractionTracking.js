import React, {useEffect, useRef, useCallback} from 'react';
import {usePrevious} from './usePrevious';

export function MediaInteractionTracking({playerState, playerActions, idleDelay, children}) {
  const hideControlsTimeout = useRef();
  const wasPlaying = usePrevious(playerState.isPlaying);
  const focusWasInside = usePrevious(playerState.focusInsideControls);

  const setHideControlsTimeout = useCallback(() => {
    clearTimeout(hideControlsTimeout.current);
    hideControlsTimeout.current = setTimeout(playerActions.userIdle, idleDelay);
  }, [playerActions.userIdle, idleDelay]);

  useEffect(() => {
    if ((!wasPlaying && playerState.isPlaying) ||
        (focusWasInside !== playerState.focusInsideControls)) {
      setHideControlsTimeout();
    }
  }, [wasPlaying, playerState.isPlaying, setHideControlsTimeout, playerState.focusInsideControls, focusWasInside]);

  const handleInteraction = function () {
    playerActions.userInteraction();
    setHideControlsTimeout();
  }

  return (
    <div onClick={handleInteraction} onMouseMove={handleInteraction}>
      {children}
    </div>
  );
}

MediaInteractionTracking.defaultProps = {
  idleDelay: 2000
};
