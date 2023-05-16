import React, {useRef, useCallback} from 'react';
import QuickPinchZoom, {make3dTransformValue} from 'react-quick-pinch-zoom';
import styles from "./FullscreenImage.module.css";

export function FullscreenImage({
  setIsFullscreen,
  imageFile,
}) {
  const imgRef = useRef();

  const onUpdate = useCallback(({ x, y, scale }) => {
    if (imgRef.current) {
      imgRef.current.style.setProperty(
        'transform',
        make3dTransformValue({ x, y, scale })
      );
    }
  }, []);

  return (
    <div className={styles.full}>
      <QuickPinchZoom onUpdate={onUpdate}
                      isTouch={() => true}
                      minZoom={0.8}
                      maxZoom={5}
                      tapZoomFactor={1.5}
                      doubleTapToggleZoom
                      enforceBoundsDuringZoom
                      centerContained>
        <img src={imageFile.urls.large}
             alt="img"
             ref={imgRef}
             className={styles.img}/>
      </QuickPinchZoom>
    </div>
  )
}
