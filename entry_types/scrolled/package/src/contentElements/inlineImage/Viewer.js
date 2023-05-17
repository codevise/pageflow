import React, {useCallback, useState, useEffect} from 'react'
import classNames from 'classnames';
import {Image, useDelayedBoolean} from 'pageflow-scrolled/frontend';
import {Fullscreen} from './Fullscreen';
import {FullscreenImage} from './FullscreenImage';
import {ToggleFullscreenButton} from '../../frontend/ToggleFullscreenButton';
import styles from "./Viewer.module.css";

export function Viewer({
  imageFile,
  shouldLoad,
  configuration,
  contentElementId
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const isRendered = useDelayedBoolean(isFullscreen, {fromTrueToFalse: 200});
  const isVisible = useDelayedBoolean(isFullscreen, {fromFalseToTrue: 1});

  const {position} = configuration

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
    window.history.pushState({fullscreenInlineImage: contentElementId}, '');
  }, [contentElementId]);

  const exitFullscreen = useCallback(() => {
    setIsFullscreen(false);

    if (window.history.state?.fullscreenInlineImage) {
      window.history.back();
    }
  }, []);

  return (
    <>
      <div onClick={enterFullscreen}>
        <Image imageFile={imageFile}
               load={shouldLoad}
               structuredData={true}
               variant={position === 'full' ? 'large' : 'medium'}
               preferSvg={true} />
        <div className={styles.controls}>
          <ToggleFullscreenButton isFullscreen={false}
                                  onEnter={enterFullscreen}
                                  onExit={exitFullscreen} />
        </div>
      </div>
      {isRendered &&
       <Fullscreen>
         <div className={classNames(styles.wrapper, {[styles.visible]: isVisible})}>
           <FullscreenImage onClose={exitFullscreen}
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
