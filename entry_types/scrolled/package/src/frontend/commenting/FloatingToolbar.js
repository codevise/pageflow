import React from 'react';

import {useI18n} from '../i18n';
import {useAddCommentMode} from './AddCommentModeProvider';

import AddCommentIcon from './images/addComment.svg';
import CancelCommentIcon from './images/cancelComment.svg';
import styles from './FloatingToolbar.module.css';

export function FloatingToolbar() {
  const {t} = useI18n({locale: 'ui'});
  const {active, toggle} = useAddCommentMode();

  const Icon = active ? CancelCommentIcon : AddCommentIcon;
  const label = t(active
    ? 'pageflow_scrolled.review.cancel_add_comment'
    : 'pageflow_scrolled.review.add_comment');

  return (
    <div className={styles.toolbar}>
      <button className={styles.button}
              onClick={toggle}
              data-add-comment-toggle
              aria-label={label}
              title={label}>
        <Icon />
      </button>
    </div>
  );
}
