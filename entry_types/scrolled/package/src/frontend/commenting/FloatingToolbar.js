import React from 'react';

import {useI18n} from '../i18n';
import {useAddCommentMode} from './AddCommentModeProvider';
import {useCommentDisplayFilter} from './CommentDisplayFilterProvider';

import AddCommentIcon from './images/addComment.svg';
import CancelCommentIcon from './images/cancelComment.svg';
import styles from './FloatingToolbar.module.css';

export function FloatingToolbar() {
  return (
    <div className={styles.toolbar}>
      <ResolutionToggleButton />
      <AddCommentButton />
    </div>
  );
}

const resolutions = ['unresolved', 'all'];

function ResolutionToggleButton() {
  const {t} = useI18n({locale: 'ui'});
  const {resolution, setResolution} = useCommentDisplayFilter();

  return (
    <div className={styles.segmented}
         role="group"
         aria-label={t('pageflow_scrolled.review.filter.label')}>
      {resolutions.map(value => (
        <button key={value}
                type="button"
                className={styles.segment}
                aria-pressed={resolution === value}
                onClick={() => setResolution(value)}>
          {t(`pageflow_scrolled.review.filter.${value}`)}
        </button>
      ))}
    </div>
  );
}

function AddCommentButton() {
  const {t} = useI18n({locale: 'ui'});
  const {active, toggle} = useAddCommentMode();

  const Icon = active ? CancelCommentIcon : AddCommentIcon;
  const label = t(active
    ? 'pageflow_scrolled.review.cancel_add_comment'
    : 'pageflow_scrolled.review.add_comment');

  return (
    <button className={styles.button}
            onClick={toggle}
            data-add-comment-toggle
            aria-label={label}
            title={label}>
      <Icon />
    </button>
  );
}
