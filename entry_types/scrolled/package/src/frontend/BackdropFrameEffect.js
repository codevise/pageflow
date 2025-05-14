import React from 'react';

import {getEffectValue} from './getEffectValue';

import styles from './BackdropFrameEffect.module.css';

export function BackdropFrameEffect({backdrop}) {
  const frameColor = getEffectValue(backdrop, 'frame');

  if (!frameColor) {
    return null;
  }

  return (
    <div className={styles.outer} style={{'--frame-color': frameColor}}>
      <div className={styles.inner} />
    </div>
  );
}
