import React from 'react';
import classNames from 'classnames';

import {ThemeIcon} from '../ThemeIcon';

import styles from './PanoramaIndicator.module.css';

export function PanoramaIndicator({visible}) {
  return (
    <div className={classNames(styles.indicator, {[styles.visible]: visible})}>
      <div className={styles.arrowLeft}>
        <div>
          <ThemeIcon name="arrowLeft" />
        </div>
      </div>
      <div className={styles.arrowRight}>
        <div>
          <ThemeIcon name="arrowRight" />
        </div>
      </div>
      <div className={styles.text}>
        360°
      </div>
    </div>
  );
}
