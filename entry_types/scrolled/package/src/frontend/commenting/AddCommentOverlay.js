import React from 'react';

import {useI18n} from '../i18n';
import {useAddCommentMode} from './AddCommentModeProvider';
import {useSelectedSubject} from './SelectedSubjectProvider';

import AddCommentIcon from './images/addComment.svg';
import styles from './AddCommentOverlay.module.css';

export function AddCommentOverlay({permaId}) {
  const {t} = useI18n({locale: 'ui'});
  const {active, deactivate} = useAddCommentMode();
  const {select} = useSelectedSubject('ContentElement', permaId);

  if (!active) return null;

  function handleClick() {
    select({showNewForm: true});
    deactivate();
  }

  return (
    <button onClick={handleClick}
            data-add-comment-overlay
            className={styles.highlight}
            aria-label={t('pageflow_scrolled.review.select_content_element')}
            title={t('pageflow_scrolled.review.select_content_element')}>
      <span className={styles.pill}>
        <AddCommentIcon />
      </span>
    </button>
  );
}
