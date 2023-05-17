import React, {useCallback, useState, useEffect} from 'react'
import classNames from 'classnames';
import {useDelayedBoolean} from '../useDelayedBoolean';
import {Fullscreen} from './Fullscreen';
import {ZoomableImage} from './ZoomableImage';
import {ToggleFullscreenButton} from '../ToggleFullscreenButton';
import {useContentElementEditorState} from '../useContentElementEditorState';

import styles from './Viewer.module.css';

export default function Viewer({
  imageFile,
  contentElementId,
  children
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const isRendered = useDelayedBoolean(isFullscreen, {fromTrueToFalse: 200});
  const isVisible = useDelayedBoolean(isFullscreen, {fromFalseToTrue: 1});

  const {isEditable, isSelected} = useContentElementEditorState();

  useEffect(() => {
    function handlePopState() {
      setIsFullscreen(
        window.history.state?.fullscreenInlineImage === contentElementId
      );
    }

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  });

  const enterFullscreen = useCallback(() => {
    setIsFullscreen(true);

    if (window.parent === window) {
      window.history.pushState({fullscreenInlineImage: contentElementId}, '');
    }
  }, [contentElementId]);

  const exitFullscreen = useCallback(() => {
    setIsFullscreen(false);

    if (window.history.state?.fullscreenInlineImage && window.parent === window) {
      window.history.back();
    }
  }, []);

  return (
    <>
      <div onClick={enterFullscreen}
           style={{pointerEvents: isEditable && !isSelected ? 'none' : undefined}}>
        {children}
        <div className={styles.controls}>
          <ToggleFullscreenButton isFullscreen={false}
                                  onEnter={enterFullscreen}
                                  onExit={exitFullscreen} />
        </div>
      </div>
      {isRendered &&
       <Fullscreen>
         <div className={classNames(styles.wrapper, {[styles.visible]: isVisible})}>
           <ZoomableImage onClose={exitFullscreen}
                          imageFile={imageFile} />
           <div className={styles.controls}>
             <ToggleFullscreenButton isFullscreen={true}
                                     onEnter={enterFullscreen}
                                     onExit={exitFullscreen} />
           </div>
         </div>
       </Fullscreen>}
    </>
  );
}
