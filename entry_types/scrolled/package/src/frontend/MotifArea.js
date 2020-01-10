import React from 'react';
import classNames from 'classnames';

import styles from './MotifArea.module.css';

import {useFile} from '../entryState';

export const MotifArea = React.forwardRef(function MotifArea(props, ref) {
  const image = useFile({collectionName: 'imageFiles', permaId: props.imageId});

  if (!image) {
    return null;
  }

  return (
    <div ref={ref}
         className={classNames(styles.root, {[styles.active]: props.active})}
         style={position(props, image)}
         onMouseEnter={props.onMouseEnter}
         onMouseLeave={props.onMouseLeave}>
      <div className={styles.topLeft} />
      <div className={styles.topRight} />
      <div className={styles.bottomLeft} />
      <div className={styles.bottomRight} />
    </div>
  );
})

function position(props, image) {
  const originalRatio = image.width / image.height;
  const containerRatio = props.containerWidth / props.containerHeight;
  const scale = containerRatio > originalRatio ?
                props.containerWidth / image.width :
                props.containerHeight / image.height;

  const contentWidth = image.width * scale;
  const contentHeight = image.height * scale;

  const focusX = image.configuration.focusX === undefined ? 50 : image.configuration.focusX;
  const focusY = image.configuration.focusY === undefined ? 50 : image.configuration.focusY;

  const cropLeft = (contentWidth - props.containerWidth) * focusX / 100;
  const cropTop = (contentHeight - props.containerHeight) * focusY / 100;

  const motifArea = image.configuration.motifArea ||
                     {top: 0, left: 0, width: 0, height: 0};

  return {
    top: contentHeight * motifArea.top / 100 - cropTop,
    left: contentWidth * motifArea.left / 100  - cropLeft,
    width: contentWidth * motifArea.width / 100,
    height: contentHeight * motifArea.height / 100
  };
}
