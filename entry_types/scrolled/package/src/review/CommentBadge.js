import React from 'react';
import classNames from 'classnames';

import {useCommentThreads} from './ReviewStateProvider';

import CommentIcon from './images/comment.svg';
import styles from './CommentBadge.module.css';

export function CommentBadge({subjectType, subjectId, onClick, mode}) {
  const threads = useCommentThreads(subjectType, subjectId);
  const unresolvedCount = threads.filter(t => !t.resolvedAt).length;
  const hasThreads = unresolvedCount > 0;

  const variant = resolveVariant(mode, hasThreads);

  if (!variant) {
    return null;
  }

  return (
    <button role="status"
            className={classNames(styles.badge, styles[variant])}
            onClick={onClick}>
      {variant !== 'dot' && <CommentIcon className={styles.icon} />}
      {(variant === 'active' || variant === 'expanded') && unresolvedCount > 1 ? unresolvedCount : null}
    </button>
  );
}

function resolveVariant(mode, hasThreads) {
  switch (mode) {
  case 'active':
    return 'active';
  case 'icon':
    return hasThreads ? 'expanded' : 'iconOnly';
  case 'dot':
    return hasThreads ? 'dot' : null;
  default:
    return hasThreads ? 'expanded' : null;
  }
}
