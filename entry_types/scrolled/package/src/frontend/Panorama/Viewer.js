import React, {useEffect, useRef, useState} from 'react';
import classNames from 'classnames';
import {PanoViewer} from '@egjs/view360';
import screenfull from 'screenfull';

import {useBrowserFeature} from '../useBrowserFeature';
import {usePhonePlatform} from '../usePhonePlatform';
import {ToggleFullscreenButton} from './ToggleFullscreenButton';
import {Fullscreen} from './Fullscreen';
import {PanoramaIndicator} from './PanoramaIndicator';
import {FullscreenIndicator} from './FullscreenIndicator';

import styles from './Viewer.module.css';
import SpinnerIcon from '../icons/spinner.svg';

export default function Viewer({
  imageFile, viewerRef, initialYaw, initialPitch, hidePanoramaIndicator, onReady, onFullscreen
}) {
  const elRef = useRef();

  const initialYawRef = useRef(initialYaw);
  const initialPitchRef = useRef(initialPitch);

  const touchSupport = useBrowserFeature('touch support')

  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const isPhonePlatform = usePhonePlatform();

  // When toggling to fullscreen mode, this component renders to a
  // portal div in the body of the document. We do not want to recreate
  // the PanoViewer instead to keep its current state (pitch, yaw etc.).
  // We therefore initialize the PanoViewer on a detached DOM element
  // and render a component called DOMNodeContainer which appends the
  // element on each render. React.memo causes the DOMNodeContainer to
  // render only when either
  // - the parent Viewer component is mounted
  // - Fullscreen component switches between using the portal or not
  function appendViewerTo(parentNode) {
    if (!elRef.current) {
      elRef.current = document.createElement('div');
      elRef.current.className = styles.full;

      viewerRef.current = new PanoViewer(
        elRef.current,
        {
          image: imageFile.urls.ultra,
          projectionType: imageFile.configuration.projection === 'equirectangular_stereo' ?
                          PanoViewer.PROJECTION_TYPE.STEREOSCOPIC_EQUI :
                          PanoViewer.PROJECTION_TYPE.EQUIRECTANGULAR,
          touchDirection: touchSupport?
                          PanoViewer.TOUCH_DIRECTION.YAW :
                          PanoViewer.TOUCH_DIRECTION.ALL,
          useZoom: false,
          yaw: initialYawRef.current,
          pitch: initialPitchRef.current
        }
      );

      viewerRef.current.on(PanoViewer.EVENTS.READY, () => {
        viewerRef.current.updateViewportDimensions();
        setIsLoading(false);

        if (onReady) {
          onReady();
        }
      });
    }

    parentNode.appendChild(elRef.current);
    viewerRef.current.updateViewportDimensions();
  }

  useEffect(() => {
    return () => {
      if (elRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
        elRef.current = null;
      }
    }
  }, [viewerRef]);

  useEffect(() => {
    if (initialYawRef.current !== initialYaw) {
      initialYawRef.current = initialYaw;
      viewerRef.current.lookAt({yaw: initialYaw}, 200);
    }
  }, [initialYaw, viewerRef]);

  useEffect(() => {
    if (initialPitchRef.current !== initialPitch) {
      initialPitchRef.current = initialPitch;
      viewerRef.current.lookAt({pitch: initialPitch}, 200);
    }
  }, [initialPitch, viewerRef]);

  useEffect(() => {
    function onChange() {
      if (!screenfull.isFullscreen) {
        setIsFullscreen(false);
      }
    }

    if (screenfull.isEnabled) {
      screenfull.on('change', onChange);
      return () => screenfull.off('change', onChange);
    }
  }, []);

  useEffect(() => {
    function onChange() {
      viewerRef.current.updateViewportDimensions();
    }

    window.addEventListener('resize', onChange);
    return () => window.removeEventListener('resize', onChange);
  }, [viewerRef]);

  useEffect(() => {
    if (isFullscreen) {
      viewerRef.current.setTouchDirection(PanoViewer.TOUCH_DIRECTION.ALL);
      viewerRef.current.setGyroMode(PanoViewer.GYRO_MODE.YAWPITCH);
      viewerRef.current.setUseZoom(true);
    }
    else {
      if (touchSupport) {
        viewerRef.current.setTouchDirection(PanoViewer.TOUCH_DIRECTION.YAW);
        viewerRef.current.lookAt({pitch: 0, fov: 65});
      }
      else {
        viewerRef.current.lookAt({fov: 65});
      }

      viewerRef.current.setGyroMode(PanoViewer.GYRO_MODE.NONE);
      viewerRef.current.setUseZoom(false);
    }
  }, [isFullscreen, viewerRef, touchSupport]);

  function preventDefaultForArrowUpDown(event) {
    if (event.key === 'ArrowUp' ||
        event.key === 'ArrowDown') {
      event.preventDefault();
    }
  }

  function enterFullscreen() {
    if (onFullscreen) {
      onFullscreen();
    }

    if (screenfull.isEnabled) {
      screenfull.request();
    }

    setIsFullscreen(true);
    viewerRef.current.enableSensor();
  }

  function exitFullscreen() {
    if (screenfull.isEnabled) {
      screenfull.exit();
    }

    setIsFullscreen(false);
  }

  return (
    <Fullscreen isFullscreen={isFullscreen}>
      <div className={styles.container}
           onKeyDown={preventDefaultForArrowUpDown}
           onClick={() => { isPhonePlatform && enterFullscreen(); }}>
        <DOMNodeContainer className={styles.full}
                          onUpdate={el => appendViewerTo(el)} />
      </div>
      <SpinnerIcon className={classNames(styles.spinner, {[styles.isLoading]: isLoading})} />

      {(!isPhonePlatform || isFullscreen) &&
       <div className={styles.controls}>
         <ToggleFullscreenButton isFullscreen={isFullscreen}
                                 onEnter={enterFullscreen}
                                 onExit={exitFullscreen} />
       </div>}
      <PanoramaIndicator visible={!isLoading &&
                                  !isPhonePlatform &&
                                  !isFullscreen &&
                                  !hidePanoramaIndicator} />
      <FullscreenIndicator visible={!isLoading &&
                                    isPhonePlatform &&
                                    !isFullscreen} />
    </Fullscreen>
  );
}

const DOMNodeContainer = React.memo(function({className, onUpdate}) {
  const ref = useRef();

  useEffect(() => {
    const current = ref.current;
    onUpdate(current);

    return () => {
      current.removeChild(current.firstChild);
    }
  });

  return (
    <div ref={ref} className={className} />
  );
}, () => true)
