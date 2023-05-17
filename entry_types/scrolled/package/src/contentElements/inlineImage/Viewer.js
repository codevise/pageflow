import React, {useState} from 'react'
import {Image} from 'pageflow-scrolled/frontend';
import {Fullscreen} from './Fullscreen';
import {FullscreenImage} from './FullscreenImage';
import {ToggleFullscreenButton} from '../../frontend/ToggleFullscreenButton';
import styles from "./Viewer.module.css";

export function Viewer({
  imageFile,
  shouldLoad,
  configuration
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const {position} = configuration

  function enterFullscreen() {
    setIsFullscreen(true);
  }

  function exitFullscreen() {
    setIsFullscreen(false);
  }

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
      {isFullscreen &&
       <Fullscreen isFullscreen={isFullscreen}>
         <div className={styles.wrapper}>
           <FullscreenImage setIsFullscreen={setIsFullscreen}
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
