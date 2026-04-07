import React from 'react';

import {useCommentThreads} from './ReviewStateProvider';

import CommentIcon from './images/comment.svg';
import styles from './CommentBadge.module.css';

export function CommentBadge({subjectType, subjectId, onClick}) {
  const threads = useCommentThreads(subjectType, subjectId);

  if (threads.length === 0) {
    return null;
  }

  return (
    <button role="status"
            className={styles.badge}
            onClick={onClick}>
      <CommentIcon className={styles.icon} />
      {threads.length}
    </button>
  );
}
