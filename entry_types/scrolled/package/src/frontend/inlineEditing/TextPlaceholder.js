import React from 'react';

import styles from './TextPlaceholder.module.css';

export function TextPlaceholder({text, visible, className}) {
  if (!text || !visible) {
    return null;
  }

  return (
    <div className={styles.placeholder}>
      <div className={className}>{text}</div>
    </div>
  );
}
