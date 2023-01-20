import React, {useState} from 'react'
import {
  Image
} from 'pageflow-scrolled/frontend';
import QuickPinchZoom, { make3dTransformValue } from "react-quick-pinch-zoom";
import { Fullscreen } from './Fullscreen';
import { canUseDOM } from './canUseDOM';
import { FullscreenImage } from './FullscreenImage';
import {usePhonePlatform} from '../../frontend/usePhonePlatform';
import {ToggleFullscreenButton} from '../../frontend/ToggleFullscreenButton';
import styles from "./Viewer.module.css";
import screenfull from 'screenfull';

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
    if (screenfull.isEnabled) {
      screenfull.request();
    }

    setIsFullscreen(true);
  }

  function exitFullscreen() {
    if (screenfull.isEnabled) {
      screenfull.exit();
    }

    setIsFullscreen(false);
  }
  console.log(isFullscreen, enableFullscreen, !isFullscreen, !enableFullscreen)

  if (canUseDOM()) {
    return (
      <Fullscreen isFullscreen={isFullscreen}>
          <div onClick={onClick}>
            <Image imageFile={imageFile}
                load={shouldLoad}
                structuredData={true}
                variant={position === 'full' ? 'large' : 'medium'}
                preferSvg={true} />
          </div>
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
