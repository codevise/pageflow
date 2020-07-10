import React from 'react';

import styles from './TextPlaceholder.module.css';

export function TextPlaceholder({text, visible}) {
  if (!text || !visible) {
    return null;
  }

  return (
    <div className={styles.placeholder}>
      {text}
    </div>
  );
}
