import React from 'react';

import styles from './ContentElementMargin.module.css';

export function ContentElementMargin({position, children}) {
  if (position === 'full') {
    return children;
  }

  return (
    <div className={styles.wrapper}>
      {children}
    </div>
  );
}
