import React from 'react';
import classNames from 'classnames';

import {useLocatedCommentThreads} from 'pageflow-scrolled/review';
import {useI18n} from '../i18n';
import {useAddCommentMode} from './AddCommentModeProvider';
import {useCommentDisplayFilter} from './CommentDisplayFilterProvider';
import {useCommentingVisibility} from './CommentingVisibilityProvider';
import {useCommentNavigation} from './SelectedSubjectProvider';

import AddCommentIcon from './images/addComment.svg';
import CancelCommentIcon from './images/cancelComment.svg';
import ChevronIcon from './images/chevron.svg';
import HideCommentsIcon from './images/hideComments.svg';
import ShowCommentsIcon from './images/showComments.svg';
import styles from './FloatingToolbar.module.css';

export function FloatingToolbar() {
  const {t} = useI18n({locale: 'ui'});
  const {visible} = useCommentingVisibility();

  if (!visible) {
    return <ShowCommentsButton />;
  }

  return (
    <div className={styles.toolbar}
         role="group"
         aria-label={t('pageflow_scrolled.review.comment_toolbar')}
         data-comment-toolbar>
      <PositionIndicator />
      <ResolutionToggleButton />
      <NavigationArrows />
      <HideCommentsButton />
      <AddCommentButton />
    </div>
  );
}

function HideCommentsButton() {
  const {t} = useI18n({locale: 'ui'});
  const {toggle} = useCommentingVisibility();
  const label = t('pageflow_scrolled.review.hide_comments');

  return (
    <button className={styles.button}
            onClick={toggle}
            aria-label={label}
            title={label}>
      <HideCommentsIcon className={styles.toggleIcon} />
    </button>
  );
}

function ShowCommentsButton() {
  const {t} = useI18n({locale: 'ui'});
  const {toggle} = useCommentingVisibility();
  const label = t('pageflow_scrolled.review.show_comments');

  return (
    <button className={styles.puck}
            onClick={toggle}
            aria-label={label}
            title={label}>
      <ShowCommentsIcon className={styles.toggleIcon} />
    </button>
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
