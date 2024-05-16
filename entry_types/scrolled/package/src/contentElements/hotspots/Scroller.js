import React from 'react';
import classNames from 'classnames';

import styles from './Scroller.module.css';

export function Scroller({areas}) {
  return (
    <div className={classNames(styles.scroller, styles.overview)}>
      {Array.from({length: areas.length + 2}, (_, index) =>
        <div key={index} className={styles.step} />
      )}
    </div>
  );
}
