import React, {useEffect, useMemo, useRef, useState} from 'react';
import classNames from 'classnames';

import {useI18n} from 'pageflow-scrolled/frontend';
import {AvatarStack} from './Avatar';
import {Comment} from './Comment';
import {ReplyForm} from './ReplyForm';
import {useCommentDraft} from './ReviewStateProvider';
import {useSubjectQuote} from './subjectQuote';
import {commentsWithOutdatedQuote} from './outdatedQuotes';
import {useMarkThreadReadWhenSeen} from './markThreadReadWhenSeen';
import {useUnreadComments} from './unreadComments';
import {useScrollHighlightedThreadIntoView} from './scrollHighlightedThreadIntoView';

import ChevronIcon from './images/chevron.svg';
import ResolveIcon from './images/resolve.svg';
import UnresolveIcon from './images/unresolve.svg';
import styles from './Thread.module.css';

export function Thread({thread, collapsed: collapsedProp, onToggle, onResolve, onClick, highlighted, showNewMarker, interactive = true}) {
  const {t} = useI18n({locale: 'ui'});
  const firstComment = thread.comments[0];
  const replies = thread.comments.slice(1);

  // Collapsing hides the reply form, which would leave a drafted reply
  // out of reach.
  const [replyDraft] = useCommentDraft({threadId: thread.id});
  const collapsed = collapsedProp && !replyDraft;

  const repliesCollapsed = collapsed && replies.length > 0;

  const newComments = useUnreadComments(thread);
  const newReplyCount = useMemo(() => {
    const ids = new Set(newComments.map(comment => comment.id));
    return replies.filter(reply => ids.has(reply.id)).length;
  }, [newComments, replies]);

  const hidesNewReplies = repliesCollapsed && newReplyCount > 0;

  // Where the unseen part of the thread starts. Only meaningful with
  // seen comments above it: a thread that is new all through says so
  // through its dot instead of repeating it at the very top.
  const firstNewReplyId = useMemo(() => {
    if (!newComments.length || newComments[0].id === firstComment?.id) {
      return null;
    }

    const ids = new Set(newComments.map(comment => comment.id));
    return replies.find(reply => ids.has(reply.id))?.id;
  }, [newComments, replies, firstComment]);

  // Kept here rather than per comment so that a thread never shows two
  // textareas at once: neither two comments being edited, nor an edit next
  // to the reply form.
  const [editingCommentId, setEditingCommentId] = useState(null);
  const editing = editingCommentId !== null;

  function editProps(comment) {
    return {
      threadId: thread.id,
      editing: editingCommentId === comment.id,
      onEdit: interactive ? () => setEditingCommentId(comment.id) : undefined,
      onEditEnd: () => setEditingCommentId(null)
    };
  }

  const currentQuote = useSubjectQuote(thread);
  const outdatedQuotes = useMemo(
    () => commentsWithOutdatedQuote(thread.comments, currentQuote),
    [thread.comments, currentQuote]
  );

  const ref = useRef();
  const scrollHighlightedIntoView = useScrollHighlightedThreadIntoView();

  useMarkThreadReadWhenSeen({thread, ref, enabled: !repliesCollapsed});

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
      {/* A lone thread needs no marker of its own: the badge that opened
          the list already says the same thing right next to it. */}
      {showNewMarker && newComments.length > 0 &&
        <span role="img"
              className={styles.newDot}
              aria-label={t('pageflow_scrolled.review.unread_comment_count',
                            {count: newComments.length})} />}

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
                 showQuote={outdatedQuotes.has(firstComment.id)}
                 {...editProps(firstComment)} />}

      {repliesCollapsed &&
        <button className={styles.expandButton} onClick={onToggle}>
          <span className={styles.replyCount}>
            {t('pageflow_scrolled.review.reply_count', {count: replies.length})}
            {hidesNewReplies &&
              <span className={styles.newReplyCount}>
                {t('pageflow_scrolled.review.new_reply_count', {count: newReplyCount})}
              </span>}
          </span>
          <AvatarStack names={replies.map(c => c.creatorName)} />
        </button>}

      {!collapsed && replies.map(comment => (
        <React.Fragment key={comment.id}>
          {comment.id === firstNewReplyId &&
            <div className={styles.newRepliesDivider}>
              {t('pageflow_scrolled.review.new_replies')}
            </div>}
          <Comment comment={comment}
                   showQuote={outdatedQuotes.has(comment.id)}
                   {...editProps(comment)} />
        </React.Fragment>
      ))}

      {interactive && !thread.resolvedAt && !repliesCollapsed && !editing &&
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
