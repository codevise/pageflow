import React from 'react';
import classNames from 'classnames';

import {getEffectValue} from './getEffectValue';

import styles from './BackdropFrameEffect.module.css';

export function BackdropFrameEffect({backdrop}) {
  const value = getEffectValue(backdrop, 'frame');

  if (!value) {
    return null;
  }

  const {color, design} = normalizeFrameValue(value);

  if (!color) {
    return null;
  }

  return (
    <div className={classNames(styles.outer, frameScopeClass(design))}
         style={{'--frame-color': color}}>
      <div className={styles.inner} />
    </div>
  );
}

function normalizeFrameValue(value) {
  if (typeof value === 'string') {
    return {color: value};
  }

  return value;
}

function frameScopeClass(design) {
  return `scope-backdropFrame-${design || 'default'}`;
}
