import React from 'react';
import classNames from 'classnames';

import Fullscreen from '../Fullscreen';
import styles from './GradientShadow.module.css';

export default function GradientShadow(props) {
  // If motif area intersects with content area horizontally, fade in
  // shadow soon as the content has been scrolled far enough to start
  // intersecting with the motif area vertically. If motif area does
  // not intersect, always make it visible. Shadow appearance will then
  // depend on alignment (i.e. a gradient from the left).
  const opacityFactor =
    props.motifAreaState.isIntersectingX ?
    // Make shadow reach full opacity when content has been scrolled
    // up half way across the motif area.
    Math.min(1, props.motifAreaState.intersectionRatioY * 2) :
    1;

  return (
    <div className={classNames(styles.root,
                   styles[`align-${props.align}`],
                   {[styles.intersecting]: props.motifAreaState.isIntersectingX})}>
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
