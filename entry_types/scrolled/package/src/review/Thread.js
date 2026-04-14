import React from 'react';

import {useI18n} from '../frontend/i18n';
import {AvatarStack} from './Avatar';
import {Comment} from './Comment';
import {ReplyForm} from './ReplyForm';

import ChevronIcon from './images/chevron.svg';
import ResolveIcon from './images/resolve.svg';
import UnresolveIcon from './images/unresolve.svg';
import styles from './Thread.module.css';

export function Thread({thread, collapsed, onToggle, onResolve}) {
  const {t} = useI18n({locale: 'ui'});
  const firstComment = thread.comments[0];
  const replies = thread.comments.slice(1);
  const repliesCollapsed = collapsed && replies.length > 0;

  return (
    <div className={styles.thread}>
      {replies.length > 0 &&
        <button className={styles.chevronButton}
                onClick={onToggle}
                aria-label={t('pageflow_scrolled.review.toggle_replies')}>
          <ChevronIcon className={collapsed ? '' : styles.chevronExpanded} />
        </button>}

      {firstComment && <Comment comment={firstComment} />}

      {repliesCollapsed &&
        <button className={styles.expandButton} onClick={onToggle}>
          {t('pageflow_scrolled.review.reply_count', {count: replies.length})}
          <AvatarStack names={replies.map(c => c.creatorName)} />
        </button>}

      {!collapsed && replies.map(comment => (
        <Comment key={comment.id} comment={comment} />
      ))}

      {!thread.resolvedAt && !repliesCollapsed &&
        <ReplyForm threadId={thread.id} />}

      {onResolve && !repliesCollapsed &&
        <div className={styles.resolveRow}>
          <button className={styles.resolveButton} onClick={onResolve}>
            {thread.resolvedAt ? <UnresolveIcon /> : <ResolveIcon />}
            {t(thread.resolvedAt
              ? 'pageflow_scrolled.review.unresolve'
              : 'pageflow_scrolled.review.resolve')}
          </button>
        </div>}
    </div>
  );
}
