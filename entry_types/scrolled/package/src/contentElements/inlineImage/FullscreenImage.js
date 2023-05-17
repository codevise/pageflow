import React, {useState, useRef, useCallback} from 'react';
import classNames from 'classnames';
import QuickPinchZoom, {make3dTransformValue} from 'react-quick-pinch-zoom';
import {SwipeToClose} from 'pageflow-scrolled/frontend';

import styles from "./FullscreenImage.module.css";

export function FullscreenImage({
  onClose,
  imageFile,
}) {
  const imgRef = useRef();
  const [isVisible, setIsVisible] = useState(true);

  const onUpdate = useCallback(({ x, y, scale }) => {
    if (imgRef.current) {
      imgRef.current.style.setProperty(
        'transform',
        make3dTransformValue({ x, y, scale })
      );
    }
  }, []);

  const handleClose = useCallback(() => {
    onClose();
    setIsVisible(false);
  }, [onClose]);

  return (
    <div className={styles.full}>
      <SwipeToClose onClose={handleClose}>
        <QuickPinchZoom containerProps={{className: styles.container}}
                        onUpdate={onUpdate}
                        isTouch={() => true}
                        minZoom={0.8}
                        maxZoom={5}
                        tapZoomFactor={1.5}
                        draggableUnZoomed={false}
                        doubleTapToggleZoom
                        enforceBoundsDuringZoom
                        centerContained>
          <img src={imageFile.urls.large}
               width={imageFile.width}
               height={imageFile.height}
               alt="img"
               ref={imgRef}
               className={classNames(styles.img, {[styles.visible]: isVisible})}/>
        </QuickPinchZoom>
      </SwipeToClose>
    </div>
  )
}
