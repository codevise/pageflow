import React from 'react';
import styles from './TimeDisplay.module.css';

import {formatTime} from './formatTime';

export function TimeDisplay(props) {
  return (
    <div data-testid={'time-display'} className={styles.timeDisplay}>
      <span className={styles.time}>{formatTime(props.currentTime)}</span>
      /
      <span className={styles.time}>{formatTime(props.duration)}</span>
    </div>
  );
}
