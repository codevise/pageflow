import React from 'react';
import classNames from 'classnames';

import Fullscreen from '../Fullscreen';
import styles from './GradientShadow.module.css';

export default function GradientShadow(props) {
  // Hide static shadow if motif area intersects with content area.
  const staticShadowOpacity =
    props.motifAreaState.isContentPadded ?
    0 :
    props.staticShadowOpacity;

  // If motif area intersects with content area horizontally, fade in
  // shadow soon as the content has been scrolled far enough to start
  // intersecting with the motif area vertically.
  const opacityFactor =
    // Make shadow reach full opacity when content has been scrolled
    // up half way across the motif area.
    roundToFirstDecimalPlace(
      Math.min(1, props.motifAreaState.intersectionRatioY * 2)
    );

  return (
    <div className={classNames(styles[`align-${props.align}`],
                               props.inverted ? styles.light : styles.dark)}>
      <div className={styles.dynamic}
           style={{opacity: props.dynamicShadowOpacity * opacityFactor}}>
        <Fullscreen />
      </div>
      <div className={styles.static}
           style={{opacity: staticShadowOpacity}}>
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

function roundToFirstDecimalPlace(value) {
  return Math.round(value * 10) / 10
}
