import React from 'react';
import classNames from 'classnames';

import styles from './MutedIndicator.module.css';

export function MutedIndicator({visible}) {
  return (
    <div className={classNames(styles.wrapper, {[styles.visible]: visible})}>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <rect className={styles.eqBar1} x="4" y="4" width="3.7" height="8"/>
        <rect className={styles.eqBar2} x="10.2" y="4" width="3.7" height="16"/>
        <rect className={styles.eqBar3} x="16.3" y="4" width="3.7" height="11"/>
      </svg>
    </div>
  );
}
