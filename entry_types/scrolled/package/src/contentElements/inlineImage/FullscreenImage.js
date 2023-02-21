import React, { useState, useRef, useCallback, useEffect } from 'react';
import QuickPinchZoom, { make3dTransformValue } from 'react-quick-pinch-zoom';
import styles from "./FullscreenImage.module.css";

export function FullscreenImage({
  setIsFullscreen,
  imageFile,
}) {
  const imgRef = useRef();
  const wrapperRef = useRef();
  const [resetScaleValue, setResetScaleValue] = useState(false);
  const url = imageFile.urls["large"];

  useEffect(() => {
    const { current: img } = imgRef;
    if ( img ) {
      img.classList.add(styles.transition);
    }
  }, [])

  useEffect(() => {
    function wheelEvent(event) {
      setIsFullscreen(false)
    }

    window.addEventListener('wheel', wheelEvent);

    return () => {
      window.removeEventListener("wheel", wheelEvent)
    };
  }, [])

  useEffect(() => {
    let start = null;

    function touchStart(event) {
      start = event.changedTouches[0];
    }

    function touchEnd(event) {
      let end = event.changedTouches[0];

      if(end.screenY - start.screenY > 0 || end.screenY - start.screenY < 0)
      {
        setIsFullscreen(false);
      }
    }

    window.addEventListener('touchstart', touchStart);
    window.addEventListener('touchend', touchEnd);

    return () => {
      window.removeEventListener("touchstart", touchStart);
      window.removeEventListener("touchend", touchEnd);
    }
  }, [])

  const onUpdate = useCallback(({ x, y, scale }) => {
    const { current: img } = imgRef;

    if (img) {
      let value;

      if ( scale === 5 && !resetScaleValue ) {
        const x = 0, y = 0, scale = 1;

        value = make3dTransformValue({ x, y, scale });
        setResetScaleValue(!resetScaleValue)
      }
      else {       
        value = make3dTransformValue({ x, y, scale });
      }
      img.style.setProperty("transform", value);
    }
  }, [resetScaleValue]);

  function onClick(event) {
    if (event.target === event.currentTarget) {
      setIsFullscreen(false)
    }
  }

  function onDoubleTap({x, y, scale}) {
    alert(x, y, scale)
  }

  const isTouch = () => true

  return (
    <div className={styles.full}
      onClick={onClick}
      ref={wrapperRef}>
      <QuickPinchZoom onUpdate={onUpdate}
                isTouch={isTouch}
                maxZoom={5}
                wheelScaleFactor={500}
                verticalPadding={10}
                draggableUnZoomed={false}
                onDoubleTap={onDoubleTap}>
        <img src={url}
          alt="img"
          ref={imgRef}
          className={styles.img}/>
      </QuickPinchZoom>
    </div>
  )
}
