import React from 'react';

import {useI18n} from '../i18n';
import styles from './FloatingToolbar.module.css';

export function FloatingToolbar() {
  const {t} = useI18n({locale: 'ui'});

  return (
    <div className={styles.toolbar}>
      {t('pageflow_scrolled.review.toolbar_label')}
    </div>
  );
}
