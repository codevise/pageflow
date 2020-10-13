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
  const file = props.file;
  const originalRatio = file.width / file.height;
  const containerRatio = props.containerWidth / props.containerHeight;
  const scale = containerRatio > originalRatio ?
                props.containerWidth / file.width :
                props.containerHeight / file.height;

  const contentWidth = file.width * scale;
  const contentHeight = file.height * scale;

  const focusX = file.configuration.focusX === undefined ? 50 : file.configuration.focusX;
  const focusY = file.configuration.focusY === undefined ? 50 : file.configuration.focusY;

  const cropLeft = (contentWidth - props.containerWidth) * focusX / 100;
  const cropTop = (contentHeight - props.containerHeight) * focusY / 100;

  const motifArea = file.configuration.motifArea ||
                     {top: 0, left: 0, width: 0, height: 0};

  return {
    top: Math.round(contentHeight * motifArea.top / 100 - cropTop),
    left: Math.round(contentWidth * motifArea.left / 100  - cropLeft),
    width: Math.round(contentWidth * motifArea.width / 100),
    height: Math.round(contentHeight * motifArea.height / 100)
  };
}
