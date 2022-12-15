import React, { useState, useRef, useCallback, useEffect } from 'react'
import {
  Image,
} from 'pageflow-scrolled/frontend';
import QuickPinchZoom, { make3dTransformValue } from "react-quick-pinch-zoom";
import { Fullscreen } from './Fullscreen';
import { canUseDOM } from './canUseDOM';
import { FullscreenImage } from './FullscreenImage';

export function Viewer({
  imageFile,
  shouldLoad,
  configuration
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  function onDoubleClick() {
    setIsFullscreen(!isFullscreen)
  }

  if (canUseDOM()) {
    return (
      <Fullscreen isFullscreen={isFullscreen}>
          {!isFullscreen &&
            <div onDoubleClick={onDoubleClick}>
              <Image imageFile={imageFile}
                  load={shouldLoad}
                  structuredData={true}
                  variant={configuration.position === 'full' ? 'large' : 'medium'}
                  preferSvg={true} />
            </div>
          }
          {isFullscreen &&
            <FullscreenImage isFullscreen={isFullscreen}
              setIsFullscreen={setIsFullscreen}
              imageFile={imageFile}>              
              
                {/* <Image imageFile={imageFile}
                  load={shouldLoad}
                  structuredData={true}
                  variant={configuration.position === 'full' ? 'large' : 'medium'}
                  preferSvg={true}
                  style={{ position: "relative" }} /> */}
            </FullscreenImage>

          }          
      </Fullscreen>
    )
  } else {
    return (
      <div></div>
    )
  }
}
