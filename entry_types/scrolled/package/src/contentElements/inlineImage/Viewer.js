import React, {useState} from 'react'
import {
  Image
} from 'pageflow-scrolled/frontend';
import { Fullscreen } from './Fullscreen';
import { canUseDOM } from './canUseDOM';
import { FullscreenImage } from './FullscreenImage';
import {usePhonePlatform} from '../../frontend/usePhonePlatform';
import {ToggleFullscreenButton} from '../../frontend/ToggleFullscreenButton';
import styles from "./Viewer.module.css";

export function Viewer({
  imageFile,
  shouldLoad,
  configuration
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const isPhonePlatform = usePhonePlatform();
  const {enableFullscreen, position} = configuration

  function onClick() {
    setIsFullscreen(!isFullscreen)
  }

  function enterFullscreen() {
    setIsFullscreen(true);
  }

  function exitFullscreen() {
    setIsFullscreen(false);
  }

  if (canUseDOM()) {
    return (
      <Fullscreen isFullscreen={isFullscreen}>
          {!isFullscreen &&
            <div onClick={onClick}>
              <Image imageFile={imageFile}
                load={shouldLoad}
                structuredData={true}
                variant={position === 'full' ? 'large' : 'medium'}
                preferSvg={true} />
            </div>}
          {(isFullscreen && enableFullscreen) &&
            <FullscreenImage isFullscreen={isFullscreen}
              setIsFullscreen={setIsFullscreen}
              imageFile={imageFile} />

          }
          {(!isPhonePlatform && enableFullscreen) &&
          <div className={styles.controls}>
            <ToggleFullscreenButton isFullscreen={isFullscreen}
                                    onEnter={enterFullscreen}
                                    onExit={exitFullscreen} />
          </div>}      
      </Fullscreen>
    )
  } else {
    return (
      <div></div>
    )
  }
}
