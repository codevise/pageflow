import React from 'react';
import classNames from 'classnames';

import Fullscreen from '../Fullscreen';
import styles from './GradientShadow.module.css';

export default function GradientShadow(props) {
  const maxOpacityOverlap = props.motifAreaRect.height / 2;
  const motifAreaOverlap = Math.min(maxOpacityOverlap, props.motifAreaRect.bottom - props.contentAreaRect.top)
  const opacityFactor = props.intersecting && props.motifAreaRect.height > 0 ? motifAreaOverlap / maxOpacityOverlap : 1;

  return (
    <div className={classNames(styles.root,
                   styles[`align-${props.align}`],
                   {[styles.intersecting]: props.intersecting})}>
      <div className={classNames(styles.shadow, props.inverted ? styles.shadowWhite : styles.shadowBlack)}
           style={{opacity: props.opacity * Math.round(opacityFactor * 10) / 10}}>
        <Fullscreen />
      </div>
      {props.children}
    </div>
  );
}

GradientShadow.defaultProps = {
  opacity: 0.7,
  align: 'left'
}
