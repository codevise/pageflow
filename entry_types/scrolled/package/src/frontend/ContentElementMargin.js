import React from 'react';

import {widths} from './layouts/widths';

import styles from './ContentElementMargin.module.css';

export function ContentElementMargin({width, children}) {
  if (width === widths.full) {
    return children;
  }

  return (
    <div className={styles.wrapper}>
      {children}
    </div>
  );
}
