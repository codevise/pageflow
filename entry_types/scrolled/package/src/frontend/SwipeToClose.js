import React, {useRef, useCallback} from 'react';

import styles from './SwipeToClose.module.css';

export function SwipeToClose({onClose, children}) {
  const start = useRef();
  const inner = useRef();
  const ratio = useRef(0);

  const handleTouchStart = useCallback(event => {
    start.current = event.touches[0].pageY;
  }, []);

  const handleTouchMove = useCallback(event => {
    const offset = Math.max(-200, Math.min(200, event.touches[0].pageY - start.current));
    ratio.current = Math.abs(offset / 200);

    requestAnimationFrame(() => {
      if (inner.current) {
        inner.current.style.setProperty('transition', `none`);
        inner.current.style.setProperty('transform', `translate3d(0, ${offset}px, 0)`);
        inner.current.style.setProperty('opacity', 1 - ratio.current);
      }
    });
  }, []);

  const handleTouchEnd = useCallback(event => {
    event.preventDefault();

    if (ratio.current > 0.5) {
      onClose();
    }

    requestAnimationFrame(() => {
      if (inner.current) {
        inner.current.style.setProperty('transition', `opacity 0.2s linear, transform 0.2s ease`);
        inner.current.style.setProperty('transform', `translate3d(0, 0, 0)`);
        inner.current.style.setProperty('opacity', 1);
      }
    });
  }, [onClose]);

  return (
    <div className={styles.outer}
         onClick={onClose}
         onTouchStart={handleTouchStart}
         onTouchMove={handleTouchMove}
         onTouchEnd={handleTouchEnd}>
      <div className={styles.inner}
           ref={inner}>
        {children}
      </div>
    </div>
  )
}
