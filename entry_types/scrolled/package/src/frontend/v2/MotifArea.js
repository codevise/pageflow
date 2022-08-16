import React, {useContext} from 'react';
import classNames from 'classnames';

import styles from '../MotifArea.module.css';

import {MotifAreaVisibilityContext} from '../MotifAreaVisibilityProvider';

export const MotifArea = function MotifArea(props) {
  const position = props.file?.isReady && getPosition(props.file.motifArea);
  const visible = useContext(MotifAreaVisibilityContext);

  if (!position) {
    return null;
  }

  return (
    <div ref={props.onUpdate}
         className={classNames(styles.root, {[styles.visible]: visible})}
         style={position} />
  );
};

MotifArea.defaultProps = {
  onUpdate: () => {}
};

function getPosition(motifArea) {
  return motifArea ?
         {
           top: `${motifArea.top}%`,
           left: `${motifArea.left}%`,
           width: `${motifArea.width}%`,
           height: `${motifArea.height}%`
         } :
         {top: 0, left: 0, width: 0, height: 0};
}
