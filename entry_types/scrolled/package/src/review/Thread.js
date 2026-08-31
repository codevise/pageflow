import React, {useEffect, useMemo, useRef, useState} from 'react';
import classNames from 'classnames';

import {useI18n, useLocale} from 'pageflow-scrolled/frontend';
import {AvatarStack} from './Avatar';
import {Comment} from './Comment';
import {CommentMenu} from './CommentMenu';
import {formatDate} from './formatDate';
import {ReplyForm} from './ReplyForm';
import {useCommentDraft} from './ReviewStateProvider';
import {useSubjectQuote} from './subjectQuote';
import {commentsWithOutdatedQuote} from './outdatedQuotes';
import {useMarkThreadReadWhenSeen} from './markThreadReadWhenSeen';
import {useUnreadActivity} from './unreadActivity';
import {useScrollHighlightedThreadIntoView} from './scrollHighlightedThreadIntoView';

import ChevronIcon from './images/chevron.svg';
import ResolveIcon from './images/resolve.svg';
import UnresolveIcon from './images/unresolve.svg';
import styles from './Thread.module.css';

export function Thread({thread, collapsed: collapsedProp, visibleReplyCount, onExpandReplies, onToggle, onReply, onResolve, onClick, highlighted, showUnreadMarker, markReadWhenHighlighted, interactive = true}) {
  const {t} = useI18n({locale: 'ui'});
  const firstComment = thread.comments[0];
  const replies = thread.comments.slice(1);

  const [replyDraft] = useCommentDraft({threadId: thread.id});
  const collapsed = collapsedProp && !replyDraft;

  const repliesCollapsed = collapsed && replies.length > 0;

  const {shownReplies, foldedReplyCount} = foldReplies(replies, {
    visibleReplyCount,
    collapsed: repliesCollapsed
  });

  const hiddenReplies = repliesCollapsed ? replies : replies.slice(0, foldedReplyCount);

  const {
    unread, unreadTopic, unreadReplyCount, unreadResolution, firstUnreadReplyId, hidesUnread
  } = useUnreadMarkers({thread, firstComment, replies, hiddenReplies});

  const hidesUnreadReplies = repliesCollapsed && unreadReplyCount > 0;

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

  useMarkThreadReadWhenSeen({
    thread,
    ref,
    enabled: !hidesUnread && (highlighted || !markReadWhenHighlighted)
  });

  useEffect(() => {
    if (scrollHighlightedIntoView && highlighted && ref.current) {
      ref.current.scrollIntoView({block: 'nearest', behavior: 'smooth'});
    }
  }, [scrollHighlightedIntoView, highlighted]);

  return (
    <div ref={ref}
         className={classNames(styles.thread, {
           [styles.highlighted]: highlighted,
           [styles.unreadTopic]: showUnreadMarker && unreadTopic,
           [styles.clickable]: onClick
         })}
         onClick={onClick}
         aria-current={highlighted ? 'true' : undefined}>
      {showUnreadMarker && unread.length > 0 &&
        <span role="img"
              className={styles.unreadDot}
              aria-label={t('pageflow_scrolled.review.unread_count',
                            {count: unread.length})} />}

      {thread.orphaned &&
        <p className={styles.deletedHint}>
          {t('pageflow_scrolled.review.refers_to_deleted_element')}
        </p>}

      {firstComment &&
        <Comment comment={firstComment}
                 showQuote={outdatedQuotes.has(firstComment.id)}
                 {...editProps(firstComment)} />}

      {replies.length > 0 && !foldedReplyCount &&
        <button className={styles.repliesToggle}
                onClick={onToggle}
                aria-expanded={!collapsed}>
          <span className={styles.replyCount}>
            <span className={styles.counts}>
              <span className={styles.count}>
                {t('pageflow_scrolled.review.reply_count', {count: replies.length})}
              </span>
              {hidesUnreadReplies &&
                <span className={styles.unreadReplyCount}>
                  {t('pageflow_scrolled.review.unread_reply_count', {count: unreadReplyCount})}
                </span>}
            </span>
            <ChevronIcon className={classNames(styles.replyChevron,
                                               {[styles.chevronExpanded]: !collapsed})} />
          </span>
          {repliesCollapsed && <AvatarStack names={replies.map(c => c.creatorName)} />}
        </button>}

      {!collapsed && foldedReplyCount > 0 &&
        <FoldedReplies count={foldedReplyCount} onExpand={onExpandReplies} />}

      {!collapsed && shownReplies.map(comment => (
        <React.Fragment key={comment.id}>
          {comment.id === firstUnreadReplyId &&
            <div className={styles.unreadRepliesDivider}>
              {t('pageflow_scrolled.review.unread_replies')}
            </div>}
          <Comment comment={comment}
                   showQuote={outdatedQuotes.has(comment.id)}
                   {...editProps(comment)} />
        </React.Fragment>
      ))}

      {interactive && !thread.resolvedAt && !repliesCollapsed && !foldedReplyCount && !editing &&
        <ReplyForm threadId={thread.id}
                   subjectType={thread.subjectType}
                   subjectId={thread.subjectId}
                   subjectRange={thread.subjectRange}
                   onSubmit={onReply} />}

      {(thread.resolvedAt || (interactive && onResolve && !repliesCollapsed)) &&
        <div className={classNames(styles.resolveRow,
                                   {[styles.unreadResolution]: unreadResolution})}>
          {thread.resolvedAt ?
           <Resolution thread={thread}
                       onUnresolve={interactive ? onResolve : undefined} /> :
           <button className={styles.resolveButton} onClick={onResolve}>
             <ResolveIcon className={styles.resolveIcon} />
             {t('pageflow_scrolled.review.resolve')}
           </button>}
        </div>}
    </div>
  );
}

function foldReplies(replies, {visibleReplyCount, collapsed}) {
  const foldedReplyCount = collapsed || visibleReplyCount === undefined ?
                           0 :
                           Math.max(replies.length - visibleReplyCount, 0);

  return {
    foldedReplyCount,
    shownReplies: foldedReplyCount > 0 ? replies.slice(foldedReplyCount) : replies
  };
}

function useUnreadMarkers({thread, firstComment, replies, hiddenReplies}) {
  const unread = useUnreadActivity(thread);

  const unreadIds = useMemo(
    () => new Set(unread.map(event => event.id)),
    [unread]
  );

  const firstUnreadReplyId = useMemo(() => {
    if (!unread.length || unread[0].id === firstComment?.id) {
      return null;
    }

    return replies.find(reply => unreadIds.has(reply.id))?.id;
  }, [unread, unreadIds, replies, firstComment]);

  return {
    unread,
    firstUnreadReplyId,
    unreadTopic: !!firstComment && unreadIds.has(firstComment.id),
    unreadReplyCount: replies.filter(reply => unreadIds.has(reply.id)).length,
    unreadResolution: unread.some(event => event.resolution),
    hidesUnread: hiddenReplies.some(reply => unreadIds.has(reply.id))
  };
}

function Resolution({thread, onUnresolve}) {
  const {t} = useI18n({locale: 'ui'});
  const locale = useLocale({locale: 'ui'});

  return (
    <>
      <ResolveIcon className={styles.resolutionIcon} />
      <div className={styles.resolution}>
        <span>
          {t(thread.resolverName
            ? 'pageflow_scrolled.review.resolution_by'
            : 'pageflow_scrolled.review.resolution')}
        </span>
        <span className={styles.resolutionMeta}>
          {thread.resolverName &&
            <span className={styles.resolver}>{thread.resolverName}</span>}
          <time dateTime={thread.resolvedAt}>
            {formatDate(thread.resolvedAt, locale)}
          </time>
        </span>
      </div>

      {onUnresolve &&
        <CommentMenu label={t('pageflow_scrolled.review.thread_actions')}
                     items={[{icon: UnresolveIcon,
                              label: t('pageflow_scrolled.review.unresolve'),
                              onSelect: onUnresolve}]} />}
    </>
  );
}

function FoldedReplies({count, onExpand}) {
  const {t} = useI18n({locale: 'ui'});
  const label = t('pageflow_scrolled.review.earlier_reply_count', {count});

  if (!onExpand) {
    return <div className={styles.foldedReplies}>{label}</div>;
  }

  return (
    <button className={styles.foldedRepliesButton} onClick={onExpand}>
      {label}
    </button>
  );
}
