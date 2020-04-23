import React from 'react';
import classNames from 'classnames';

import styles from './TimeDisplay.module.css';

export function TimeDisplay() {
  return (
    <div>
      <span className={classNames(styles.timeDisplay)}>0:45</span>
      <span className={classNames(styles.timeDisplay)}>/</span>
      <span className={classNames(styles.timeDisplay)}>2:38</span>
    </div>
  );
}
