import React from 'react';
import classNames from 'classnames';

import {widths} from '../layouts';
import styles from './InvisibleBoxWrapper.module.css';

export function InvisibleBoxWrapper({position, width, openStart, openEnd, children}) {
  const full = (width === widths.full);

  return (
    <div className={classNames({
      [styles.start]: !openStart && !full,
      [styles.end]: !openEnd && !full
    })}>
      {children}
    </div>
  )
}
