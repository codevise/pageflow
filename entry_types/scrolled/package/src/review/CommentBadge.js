import React from 'react';
import classNames from 'classnames';

import {useCommentThreads} from './ReviewStateProvider';

import CommentIcon from './images/comment.svg';
import styles from './CommentBadge.module.css';

export function CommentBadge({subjectType, subjectId, onClick, active, hidden}) {
  const threads = useCommentThreads(subjectType, subjectId);

  if (hidden || (threads.length === 0 && !active)) {
    return null;
  }

  return (
    <button role="status"
            className={classNames(styles.badge, {[styles.active]: active})}
            onClick={onClick}>
      <CommentIcon className={styles.icon} />
      {threads.length > 0 && threads.length}
    </button>
  );
}
