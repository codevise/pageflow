import React, { useState, useRef, useCallback, useEffect } from 'react';
import QuickPinchZoom, { make3dTransformValue } from 'react-quick-pinch-zoom';
import styles from "./FullscreenImage.module.css";
import {usePhonePlatform} from '../../frontend/usePhonePlatform';

export function FullscreenImage({
  setIsFullscreen,
  isFullScreen,
  imageFile,
}) {
  const imgRef = useRef();
  const wrapperRef = useRef();
  const [resetScaleValue, setResetScaleValue] = useState(false);
  const isPhonePlatform = usePhonePlatform();
  let lastScrollTop = 0;
  const url = imageFile.urls["large"];

  const zoomFactor = isPhonePlatform ? 5 : 0

  useEffect(() => {
    const { current: img } = imgRef;
    if ( img ) {
      img.classList.add(styles.transition);
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
        // console.log(x, y, scale, resetScaleValue)
      }
      else {       
        value = make3dTransformValue({ x, y, scale });
      }
      
      // console.log(value, x, y, scale, resetScaleValue)
      img.style.setProperty("transform", value);
    }
  }, [resetScaleValue]);

  function toggleWillChange() {
    const { current: img } = imgRef;

    if (img) {
      requestAnimationFrame(() => {
        img.style.setProperty("will-change", "auto");

        requestAnimationFrame(() => {
          img.style.setProperty("will-change", "transform");
        });
      });
    }
  };

  function onClick(event) {
    if (event.target === event.currentTarget) {
      setIsFullscreen(false)
    }
  }

  function onInterceptWheel(event) {
    var currentScrollPos = event.offSetY || document.documentElement.scrollTop
    if ( currentScrollPos > lastScrollTop ) setIsFullscreen(false);

    lastScrollTop = currentScrollPos <= 0 ? 0 : currentScrollPos;
  }

  return (
    <div className={styles.full}
      onClick={onClick}
      ref={wrapperRef}>
      <QuickPinchZoom onUpdate={onUpdate}
                maxZoom={zoomFactor}
                wheelScaleFactor={500}
                shouldInterceptWheel={onInterceptWheel}
                verticalPadding={10}
                draggableUnZoomed={false}>
        <img src={url}
          alt="img"
          ref={imgRef}
          className={styles.img}/>
      </QuickPinchZoom>
    </div>
  )
}
