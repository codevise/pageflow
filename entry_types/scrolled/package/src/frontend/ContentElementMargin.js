import React from 'react';

import {widths} from './layouts/widths';

import styles from './ContentElementMargin.module.css';

export function ContentElementMargin({width, top, bottom, children}) {
  if (width === widths.full) {
    return children;
  }

  return (
    <div className={styles.wrapper}
         style={{marginTop: scaleProperty(top),
                 marginBottom: scaleProperty(bottom)}}>
      {children}
    </div>
  );
}

function scaleProperty(value) {
  return value && `var(--theme-content-element-margin-${value})`;
}
