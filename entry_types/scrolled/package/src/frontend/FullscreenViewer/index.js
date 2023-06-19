import React, {useCallback, useState, useEffect} from 'react'
import classNames from 'classnames';
import {useDelayedBoolean} from '../useDelayedBoolean';
import {Fullscreen} from './Fullscreen';
import {ToggleFullscreenCornerButton} from '../ToggleFullscreenCornerButton';

import styles from './index.module.css';

export function FullscreenViewer({
  contentElementId,
  renderChildren,
  renderFullscreenChildren
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const isRendered = useDelayedBoolean(isFullscreen, {fromTrueToFalse: 200});
  const isVisible = useDelayedBoolean(isFullscreen, {fromFalseToTrue: 1});

  useEffect(() => {
    function handlePopState() {
      setIsFullscreen(
        window.history.state?.fullscreenContentElementId === contentElementId
      );
    }

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  });

  const enterFullscreen = useCallback(() => {
    setIsFullscreen(true);

    if (window.parent === window) {
      window.history.pushState({fullscreenContentElementId: contentElementId}, '');
    }
  }, [contentElementId]);

  const exitFullscreen = useCallback(() => {
    setIsFullscreen(false);

    if (window.history.state?.fullscreenContentElementId && window.parent === window) {
      window.history.back();
    }
  }, []);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        exitFullscreen();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [exitFullscreen]);

  return (
    <>
      {renderChildren({enterFullscreen, isFullscreen})}
      {isRendered &&
       <Fullscreen>
         <div className={classNames(styles.wrapper, {[styles.visible]: isVisible})}>
           {renderFullscreenChildren({exitFullscreen})}
           <ToggleFullscreenCornerButton isFullscreen={true}
                                         onExit={exitFullscreen} />
         </div>
       </Fullscreen>}
    </>
  );
}
