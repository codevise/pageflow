import React, {
  useState,
  useCallback,
  useEffect,
  useRef
} from 'react';
import classNames from 'classnames';
import screenfull from 'screenfull';

import {
  ToggleFullscreenCornerButton,
  usePhonePlatform,
  usePlayerControlsInactive
} from 'pageflow-scrolled/frontend';

import styles from './FullscreenVideo.module.css';

// Wraps a video player and adds a corner button that toggles real
// device fullscreen. Uses the Fullscreen API via screenfull where
// available (desktop and Android) so that the custom controls rendered
// inside the container remain visible. On iPhone, where the Fullscreen
// API is not available for arbitrary elements, hands off to the native
// video player overlay via webkitEnterFullscreen. Exiting via the
// platform (Esc, Android back gesture, native player) is picked up
// through the change events.
export function FullscreenVideo({playerState, keepButtonVisible, children}) {
  const {mediaElementId} = playerState;
  const containerRef = useRef();
  const isPhonePlatform = usePhonePlatform();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const controlsInactive = usePlayerControlsInactive(playerState);
  const fadedOut = playerState.shouldPlay && controlsInactive && !keepButtonVisible;

  const getVideoElement = useCallback(() => {
    if (mediaElementId) {
      const element = document.getElementById(mediaElementId);

      if (element) {
        return element;
      }
    }

    return containerRef.current?.querySelector('video');
  }, [mediaElementId]);

  const enterFullscreen = useCallback(() => {
    const video = getVideoElement();

    if (isPhonePlatform && video?.webkitEnterFullscreen) {
      video.webkitEnterFullscreen();
    }
    else if (screenfull.isEnabled && containerRef.current) {
      screenfull.request(containerRef.current);
    }

    setIsFullscreen(true);
  }, [getVideoElement, isPhonePlatform]);

  const exitFullscreen = useCallback(() => {
    if (screenfull.isEnabled && screenfull.isFullscreen) {
      screenfull.exit();
    }

    const video = getVideoElement();

    if (video?.webkitDisplayingFullscreen) {
      video.webkitExitFullscreen();
    }

    setIsFullscreen(false);
  }, [getVideoElement]);

  useEffect(() => {
    function handleScreenfullChange() {
      if (!screenfull.isFullscreen) {
        setIsFullscreen(false);
      }
    }

    function handleNativePlayerExit() {
      setIsFullscreen(false);
    }

    if (screenfull.isEnabled) {
      screenfull.on('change', handleScreenfullChange);
    }

    const video = getVideoElement();

    if (video) {
      video.addEventListener('webkitendfullscreen', handleNativePlayerExit);
    }

    return () => {
      if (screenfull.isEnabled) {
        screenfull.off('change', handleScreenfullChange);
      }

      if (video) {
        video.removeEventListener('webkitendfullscreen', handleNativePlayerExit);
      }
    };
  }, [getVideoElement]);

  return (
    <div ref={containerRef} className={styles.container}>
      {children}
      <div className={classNames(styles.button, {[styles.fadedOut]: fadedOut})}>
        <ToggleFullscreenCornerButton isFullscreen={isFullscreen}
                                      onEnter={enterFullscreen}
                                      onExit={exitFullscreen} />
      </div>
    </div>
  );
}
