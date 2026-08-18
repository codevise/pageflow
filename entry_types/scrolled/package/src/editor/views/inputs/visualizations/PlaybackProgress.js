import React, {forwardRef, useImperativeHandle, useRef} from 'react';

import styles from './PlaybackProgress.module.css';

// Progress is updated on every frame of the scroll animation. Setting
// it imperatively prevents rerendering the surrounding preview.
export const PlaybackProgress = forwardRef(function PlaybackProgress(props, ref) {
  const percentRef = useRef();
  const barRef = useRef();

  useImperativeHandle(ref, () => ({
    setProgress(progress) {
      percentRef.current.textContent = `${Math.round(progress * 100)}%`;
      barRef.current.style.width = `${progress * 100}%`;
    }
  }), []);

  return (
    <div className={styles.playbackProgress}>
      <div ref={barRef} className={styles.bar} />
      <span ref={percentRef} className={styles.percent} />
    </div>
  );
});
