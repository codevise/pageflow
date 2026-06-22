import React from 'react';
import classNames from 'classnames';

import {useI18n} from '../i18n';
import {useAddCommentMode} from './AddCommentModeProvider';
import {useCommentDisplayFilter} from './CommentDisplayFilterProvider';
import {useCommentNavigation} from './SelectedSubjectProvider';

import AddCommentIcon from './images/addComment.svg';
import CancelCommentIcon from './images/cancelComment.svg';
import ChevronIcon from './images/chevron.svg';
import styles from './FloatingToolbar.module.css';

export function FloatingToolbar() {
  const {t} = useI18n({locale: 'ui'});

  return (
    <div className={styles.toolbar}
         role="group"
         aria-label={t('pageflow_scrolled.review.comment_toolbar')}
         data-comment-toolbar>
      <ResolutionToggleButton />
      <ThreadNavigation />
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

function ThreadNavigation() {
  const {t} = useI18n({locale: 'ui'});
  const {count, position, goToPrevious, goToNext} = useCommentNavigation();

  return (
    <>
      <span className={styles.count}
            title={t('pageflow_scrolled.review.comment_count', {count})}>
        {position ? `${position} / ${count}` : count}
      </span>
      <button className={styles.button}
              onClick={goToPrevious}
              disabled={count === 0}
              aria-label={t('pageflow_scrolled.review.previous_comment')}
              title={t('pageflow_scrolled.review.previous_comment')}>
        <ChevronIcon className={styles.chevronUp} />
      </button>
      <button className={styles.button}
              onClick={goToNext}
              disabled={count === 0}
              aria-label={t('pageflow_scrolled.review.next_comment')}
              title={t('pageflow_scrolled.review.next_comment')}>
        <ChevronIcon className={styles.chevronDown} />
      </button>
    </>
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
    <button className={classNames(styles.button, styles.addButton)}
            onClick={toggle}
            data-add-comment-toggle
            aria-label={label}
            title={label}>
      <Icon />
    </button>
  );
}
