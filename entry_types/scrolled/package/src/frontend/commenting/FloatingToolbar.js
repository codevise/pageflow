import React from 'react';
import classNames from 'classnames';

import {useLocatedCommentThreads} from 'pageflow-scrolled/review';
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
      <PositionIndicator />
      <ResolutionToggleButton />
      <NavigationArrows />
      <AddCommentButton />
    </div>
  );
}

function PositionIndicator() {
  const {t} = useI18n({locale: 'ui'});
  const {count, position} = useCommentNavigation();

  return (
    <span className={styles.count}
          title={t('pageflow_scrolled.review.comment_count', {count})}>
      {position || '–'} /
    </span>
  );
}

function NavigationArrows() {
  const {t} = useI18n({locale: 'ui'});
  const {count, goToPrevious, goToNext} = useCommentNavigation();

  return (
    <div className={styles.navigation}>
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
    </div>
  );
}

const resolutions = ['unresolved', 'all'];

function ResolutionToggleButton() {
  const {t} = useI18n({locale: 'ui'});
  const {resolution, setResolution} = useCommentDisplayFilter();
  const {threads} = useLocatedCommentThreads();

  const counts = {
    unresolved: threads.filter(thread => !thread.resolvedAt).length,
    all: threads.length
  };

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
          <span className={styles.segmentCount} aria-hidden="true">
            {counts[value]}
          </span>
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
    <button className={classNames(styles.button, styles.addButton)}
            onClick={toggle}
            data-add-comment-toggle
            aria-label={label}
            title={label}>
      <Icon />
    </button>
  );
}
