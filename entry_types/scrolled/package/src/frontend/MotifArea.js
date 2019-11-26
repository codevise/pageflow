import React from 'react';
import classNames from 'classnames';

import styles from './MotifArea.module.css';

export default React.forwardRef(function MotifArea(props, ref) {
  return (
    <div ref={ref}
         className={classNames(styles.root, {[styles.active]: props.active})}
         style={position(props)}
         onMouseEnter={props.onMouseEnter}
         onMouseLeave={props.onMouseLeave}>
      <div className={styles.topLeft} />
      <div className={styles.topRight} />
      <div className={styles.bottomLeft} />
      <div className={styles.bottomRight} />
    </div>
  );
})

function position(props) {
  const image = props.image;

  const originalRatio = image.width / image.height;
  const containerRatio = props.containerWidth / props.containerHeight;
  const scale = containerRatio > originalRatio ?
                props.containerWidth / image.width :
                props.containerHeight / image.height;

  const contentWidth = image.width * scale;
  const contentHeight = image.height * scale;

  const focusX = image.focusX === undefined ? 50 : image.focusX;
  const focusY = image.focusY === undefined ? 50 : image.focusY;

  const cropLeft = (contentWidth - props.containerWidth) * focusX / 100;
  const cropTop = (contentHeight - props.containerHeight) * focusY / 100;

  return {
    top: contentHeight * image.motiveArea.top / 100 - cropTop,
    left: contentWidth * image.motiveArea.left / 100  - cropLeft,
    width: contentWidth * image.motiveArea.width / 100,
    height: contentHeight * image.motiveArea.height / 100
  };
}
