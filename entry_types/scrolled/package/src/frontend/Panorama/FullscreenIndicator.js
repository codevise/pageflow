import React from 'react';
import classNames from 'classnames';

import {ThemeIcon} from '../ThemeIcon';

import styles from './FullscreenIndicator.module.css';

export function FullscreenIndicator({visible, onClick}) {
  return (
    <div className={classNames(styles.indicator, {[styles.visible]: visible})}>
      <div className={styles.icons}>
        <div className={styles.iconTopLeft}>
          <ThemeIcon name="arrowLeft" />
        </div>
        <div className={styles.iconTopRight}>
          <ThemeIcon name="arrowLeft" />
        </div>
        <div className={styles.iconBottomRight}>
          <ThemeIcon name="arrowLeft" />
        </div>
        <div className={styles.iconBottomLeft}>
          <ThemeIcon name="arrowLeft" />
        </div>
      </div>
      <div className={styles.text}>
        360°
      </div>
    </div>
  );
}
