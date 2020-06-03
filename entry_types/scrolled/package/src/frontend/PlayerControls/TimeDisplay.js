import React from 'react';
import styles from './TimeDisplay.module.css';

export const unknownTimePlaceholder = '-:--';

export function TimeDisplay(props) {
  function format(value) {
    if (isNaN(value)) {
      return unknownTimePlaceholder;
    }

    const seconds = Math.floor(value) % 60;
    const minutes = Math.floor(value / 60) % 60;
    const hours = Math.floor(value / 60 / 60);

    if (hours > 0) {
      return `${hours}:${pad(minutes)}:${pad(seconds)}`;
    }
    else {
      return `${minutes}:${pad(seconds)}`;
    }
  }

  function pad(value) {
    return value < 10 ? ('0' + value) : value;
  }

  return (
    <div data-testid={'time-display'}>
      <span className={styles.timeDisplay}>{format(props.currentTime)}</span>
      <span className={styles.timeDisplay}>/</span>
      <span className={styles.timeDisplay}>{format(props.duration)}</span>
    </div>
  );
}
