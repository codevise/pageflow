import React from 'react';
import classNames from 'classnames';

import styles from './ProgressIndicators.module.css';

export function ProgressIndicators() {
  return (
    <div className={classNames(styles.progressIndicatorsContainer)}>
      <div className={classNames(styles.progressBarsContainer)}>
        <div className={classNames(styles.progressBar, styles.loadingProgressBar)}>&nbsp;</div>
        <div className={classNames(styles.progressBar, styles.playProgressBar)}>&nbsp;</div>
        <div className={classNames(styles.sliderHandle)}>&nbsp;</div>
      </div>
    </div>
  );
}
