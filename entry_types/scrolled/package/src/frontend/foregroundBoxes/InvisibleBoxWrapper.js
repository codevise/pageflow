import React from 'react';
import classNames from 'classnames';

import styles from './InvisibleBoxWrapper.module.css';

export function InvisibleBoxWrapper({position, openStart, openEnd, children}) {
  return(
    <div className={classNames({
        [styles.start]: !openStart && position !== 'full',
        [styles.end]: !openEnd && position !== 'full'
      })}>
      {children}
    </div>
  )
}
