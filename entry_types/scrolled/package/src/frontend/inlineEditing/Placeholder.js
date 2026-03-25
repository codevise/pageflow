import React from 'react';
import styles from '../Placeholder.module.css';

export function Placeholder() {
  return (
    <div className={styles.placeholder}>
      <svg width="100%" height="100%" preserveAspectRatio="none">
        <line x1="0" y1="0" x2="100%" y2="100%"
              stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <line x1="100%" y1="0" x2="0" y2="100%"
              stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
      </svg>
    </div>
  );
}
