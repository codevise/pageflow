import React from 'react';
import classNames from 'classnames';
import {ThemeIcon, useI18n} from 'pageflow-scrolled/frontend';

import styles from './ScrollButton.module.css';

const size = 60;

export function ScrollButton({direction, disabled, onClick}) {
  const {t} = useI18n();

  return (
    <button className={classNames(styles.button,
                                  styles[direction],
                                  {[styles.disabled]: disabled})}
            onClick={onClick}>
      <div className={styles.icon}>
        <ThemeIcon name={direction === 'left' ? 'arrowLeft' : 'arrowRight'}
                   width={size}
                   height={size} />
        <span className={styles.visuallyHidden}>
          {t(direction === 'left' ?
             'pageflow_scrolled.public.previous' :
             'pageflow_scrolled.public.next')}
        </span>
      </div>
    </button>
  );
}
