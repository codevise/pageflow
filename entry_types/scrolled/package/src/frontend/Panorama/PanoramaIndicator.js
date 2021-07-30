import React from 'react';
import classNames from 'classnames';

import ArrowLeftIcon from '../icons/arrowLeft.svg';
import ArrowRightIcon from '../icons/arrowRight.svg';

import styles from './PanoramaIndicator.module.css';

export function PanoramaIndicator({visible}) {
  const size = 40;

  return (
    <div className={classNames(styles.indicator, {[styles.visible]: visible})}>
      <div className={styles.arrowLeft}>
        <div>
          <ArrowLeftIcon width={size} height={size} />
        </div>
      </div>
      <div className={styles.arrowRight}>
        <div>
          <ArrowRightIcon width={size} height={size} />
        </div>
      </div>
      <div className={styles.text}>
        360°
      </div>
    </div>
  );
}
