import React, {useEffect, useMemo, useRef} from 'react';
import classNames from 'classnames';

import {useI18n} from 'pageflow-scrolled/frontend';
import {AvatarStack} from './Avatar';
import {Comment} from './Comment';
import {ReplyForm} from './ReplyForm';
import {useCommentDraft} from './ReviewStateProvider';
import {useSubjectQuote} from './subjectQuote';
import {commentsWithOutdatedQuote} from './outdatedQuotes';
import {useScrollHighlightedThreadIntoView} from './scrollHighlightedThreadIntoView';

import ChevronIcon from './images/chevron.svg';
import ResolveIcon from './images/resolve.svg';
import UnresolveIcon from './images/unresolve.svg';
import styles from './Thread.module.css';

export function Thread({thread, collapsed: collapsedProp, onToggle, onResolve, onClick, highlighted, interactive = true}) {
  const {t} = useI18n({locale: 'ui'});
  const firstComment = thread.comments[0];
  const replies = thread.comments.slice(1);

  // Collapsing hides the reply form, which would leave a drafted reply
  // out of reach.
  const [replyDraft] = useCommentDraft({threadId: thread.id});
  const collapsed = collapsedProp && !replyDraft;

  const repliesCollapsed = collapsed && replies.length > 0;

  const currentQuote = useSubjectQuote(thread);
  const outdatedQuotes = useMemo(
    () => commentsWithOutdatedQuote(thread.comments, currentQuote),
    [thread.comments, currentQuote]
  );

  const ref = useRef();
  const scrollHighlightedIntoView = useScrollHighlightedThreadIntoView();

  useEffect(() => {
    if (scrollHighlightedIntoView && highlighted && ref.current) {
      ref.current.scrollIntoView({block: 'nearest', behavior: 'smooth'});
    }
  }, [scrollHighlightedIntoView, highlighted]);

  return (
    <div ref={ref}
         className={classNames(styles.thread, {
           [styles.highlighted]: highlighted,
           [styles.clickable]: onClick,
           [styles.resolved]: thread.resolvedAt
         })}
         onClick={onClick}
         aria-current={highlighted ? 'true' : undefined}>
      {replies.length > 0 &&
        <button className={styles.chevronButton}
                onClick={onToggle}
                aria-label={t('pageflow_scrolled.review.toggle_replies')}>
          <ChevronIcon className={collapsed ? '' : styles.chevronExpanded} />
        </button>}

      {thread.orphaned &&
        <p className={styles.deletedHint}>
          {t('pageflow_scrolled.review.refers_to_deleted_element')}
        </p>}

      {firstComment &&
        <Comment comment={firstComment}
                 showQuote={outdatedQuotes.has(firstComment.id)} />}

      {repliesCollapsed &&
        <button className={styles.expandButton} onClick={onToggle}>
          {t('pageflow_scrolled.review.reply_count', {count: replies.length})}
          <AvatarStack names={replies.map(c => c.creatorName)} />
        </button>}

      {!collapsed && replies.map(comment => (
        <Comment key={comment.id}
                 comment={comment}
                 showQuote={outdatedQuotes.has(comment.id)} />
      ))}

      {interactive && !thread.resolvedAt && !repliesCollapsed &&
        <ReplyForm threadId={thread.id}
                   subjectType={thread.subjectType}
                   subjectId={thread.subjectId}
                   subjectRange={thread.subjectRange} />}

      {interactive && onResolve && !repliesCollapsed &&
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
