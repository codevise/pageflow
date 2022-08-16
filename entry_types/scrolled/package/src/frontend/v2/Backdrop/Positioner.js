import React from 'react';

import styles from './Positioner.module.css';

export function Positioner({children}) {
  return (
    <div className={styles.wrapper}>
      {children}
    </div>
  );
}
