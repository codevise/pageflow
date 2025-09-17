import React from 'react';
import classNames from 'classnames';

import {ThemeIcon, useI18n} from 'pageflow-scrolled/frontend';

import styles from './CloseButton.module.css';

export function CloseButton({invert, onClick}) {
  const {t} = useI18n();

  return (
    <button className={classNames(styles.button,
                                  {[styles.invert]: invert})}
            aria-label={t('pageflow_scrolled.public.close')}
            title={t('pageflow_scrolled.public.close')}
            onClick={onClick}>
      <ThemeIcon name="close" width={30} height={30} />
    </button>
  );
}
