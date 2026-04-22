import React from 'react';

import {useI18n} from '../i18n';

import styles from './AddCommentHint.module.css';

export function AddCommentHint() {
  const {t} = useI18n({locale: 'ui'});

  return (
    <div className={styles.hint}>
      <span className={styles.tooltip}>
        {t('pageflow_scrolled.review.select_text_to_comment')}
      </span>
    </div>
  );
}
