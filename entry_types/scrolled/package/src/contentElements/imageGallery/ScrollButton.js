import React from 'react';
import classNames from 'classnames';
import {ThemeIcon} from 'pageflow-scrolled/frontend';

import styles from './ScrollButton.module.css';

const size = 40;

export function ScrollButton({direction, onClick}) {
  return (
    <button className={classNames(styles.button, styles[direction])}
            onClick={onClick}>
      <div className={styles.icon}>
        <ThemeIcon name={direction === 'left' ? 'arrowLeft' : 'arrowRight'}
                   width={size}
                   height={size} />
      </div>
    </button>
  );
}
