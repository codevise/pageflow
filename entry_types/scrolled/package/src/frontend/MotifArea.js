import React, {useRef, useEffect, useCallback} from 'react';
import classNames from 'classnames';

import styles from './MotifArea.module.css';

export const MotifArea = function MotifArea(props) {
  const lastPosition = useRef();
  const position = props.file?.isReady && getPosition(props);

  const elementRef = useRef();
  const onUpdate = props.onUpdate;

  const setElementRef = useCallback(element => {
    elementRef.current = element;
    onUpdate(element);
  }, [elementRef, onUpdate]);

  useEffect(() => {
    if (lastPosition.current &&
        position &&
        (lastPosition.current.top !== position.top ||
         lastPosition.current.left !== position.left ||
         lastPosition.current.width !== position.width ||
         lastPosition.current.height !== position.height)) {
      onUpdate(elementRef.current);
    }

    lastPosition.current = position;
  });

  if (!position) {
    return null;
  }

  return (
    <div ref={setElementRef}
         className={classNames(styles.root, {[styles.active]: props.active})}
         style={position}
         onMouseEnter={props.onMouseEnter}
         onMouseLeave={props.onMouseLeave}>
      <div className={styles.topLeft} />
      <div className={styles.topRight} />
      <div className={styles.bottomLeft} />
      <div className={styles.bottomRight} />
    </div>
  );
};

MotifArea.defaultProps = {
  onUpdate: () => {}
};

function getPosition(props) {
  return props.file.motifAreaOffsetRect || {top: 0, left: 0, width: 0, height: 0};
}
