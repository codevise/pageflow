import React from 'react';
import classNames from 'classnames';

import ArrowLeftIcon from '../icons/arrowLeft.svg';

import styles from './FullscreenIndicator.module.css';

export function FullscreenIndicator({visible, onClick}) {
  const size = 50;

  return (
    <div className={classNames(styles.indicator, {[styles.visible]: visible})}>
      <div className={styles.icons}>
        <div className={styles.iconTopLeft}>
          <ArrowLeftIcon  width={size} height={size} />
        </div>
        <div className={styles.iconTopRight}>
          <ArrowLeftIcon width={size} height={size} />
        </div>
        <div className={styles.iconBottomRight}>
          <ArrowLeftIcon width={size} height={size} />
        </div>
        <div className={styles.iconBottomLeft}>
          <ArrowLeftIcon width={size} height={size} />
        </div>
      </div>
      <div className={styles.text}>
        360°
      </div>
    </div>
  );
}
