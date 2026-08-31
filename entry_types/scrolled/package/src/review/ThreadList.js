import React, {useMemo, useState} from 'react';
import classNames from 'classnames';

import {useI18n} from 'pageflow-scrolled/frontend';
import {useCommentDraft} from './ReviewStateProvider';
import {useLocatedCommentThreadsForSubject} from './useLocatedCommentThreadsForSubject';
import {CommentThreadReadsSnapshot} from './commentThreadReadsSnapshot';
import {Thread} from './Thread';
import {NewThreadForm} from './NewThreadForm';
import {postUpdateThreadMessage} from './postMessage';

import ChevronIcon from './images/chevron.svg';
import NewTopicIcon from './images/newTopic.svg';
import styles from './ThreadList.module.css';

export function ThreadList({subjectType, subjectId, subjectRange, filter, resolution, highlightedThreadId, onThreadClick, restrictInteractionsToHighlighted, showNewForm: showNewFormProp, hideNewTopicButton, reversed, expandResolved, startCollapsed, markReadWhenHighlighted}) {
  const {t} = useI18n({locale: 'ui'});

  const pickedThreadId = Array.isArray(highlightedThreadId) ? null : highlightedThreadId;

  const {activeThreads, resolvedThreads} = useThreadsByResolution({
    subjectType, subjectId, subjectRange, filter, resolution, pickedThreadId
  });

  const isHighlighted = thread => Array.isArray(highlightedThreadId) ?
                                  highlightedThreadId.includes(thread.id) :
                                  thread.id === highlightedThreadId;

  const noThreads = activeThreads.length === 0 && resolvedThreads.length === 0;

  const [draft] = useCommentDraft({subjectType, subjectId});
  const [expandedThreadId, setExpandedThreadId] = useState(
    () => startCollapsed ? undefined :
          (soleThread(activeThreads) || soleThread(resolvedThreads))?.id
  );
  const [resolvedToggled, setResolvedToggled] = useState(null);

  const revealsResolved =
    !!expandResolved || resolution === 'all' ||
    resolvedThreads.some(thread => thread.id === pickedThreadId);

  const [formToggled, setFormToggled] = useState(
    showNewFormProp !== undefined ? showNewFormProp :
    revealsResolved ? noThreads : activeThreads.length === 0
  );

  const showResolved = resolvedToggled !== null ? resolvedToggled : revealsResolved;

  const showNewForm = showNewFormProp !== false && (!!draft || formToggled);

  function toggleThread(threadId) {
    setExpandedThreadId(expandedThreadId === threadId ? null : threadId);
  }

  return (
    <CommentThreadReadsSnapshot resetOn={expandedThreadId}>
      <div className={styles.container}>
        {!showNewForm && !hideNewTopicButton &&
          <button className={classNames(styles.newTopicButton,
                                        {[styles.reversed]: reversed})}
                  onClick={() => setFormToggled(true)}
                  aria-label={t('pageflow_scrolled.review.new_topic')}>
            <NewTopicIcon />
            {t('pageflow_scrolled.review.new_topic')}
          </button>}

        {showNewForm &&
          <NewThreadForm subjectType={subjectType}
                         subjectId={subjectId}
                         subjectRange={subjectRange}
                         onSubmit={() => setFormToggled(false)} />}

        {noThreads && !showNewForm &&
          <p className={styles.blankSlate}>
            {t('pageflow_scrolled.review.no_threads_yet')}
          </p>}

        {activeThreads.map(thread => (
          <Thread key={thread.id}
                  thread={thread}
                  collapsed={expandedThreadId !== thread.id}
                  showUnreadMarker={activeThreads.length > 1}
                  onToggle={() => toggleThread(thread.id)}
                  onReply={() => setExpandedThreadId(thread.id)}
                  markReadWhenHighlighted={markReadWhenHighlighted}
                  onResolve={() => postUpdateThreadMessage({threadId: thread.id, resolved: true})}
                  onClick={onThreadClick && (() => onThreadClick(thread))}
                  highlighted={isHighlighted(thread)}
                  interactive={!restrictInteractionsToHighlighted || isHighlighted(thread)} />
        ))}

        {resolvedThreads.length > 0 &&
          <div className={styles.resolvedSection}>
            <button className={styles.resolvedPill}
                    onClick={() => setResolvedToggled(!showResolved)}>
              {t('pageflow_scrolled.review.resolved_count', {count: resolvedThreads.length})}
              <ChevronIcon className={classNames(styles.chevron,
                                                 {[styles.chevronExpanded]: showResolved})} />
            </button>

            {showResolved && resolvedThreads.map(thread => (
              <Thread key={thread.id}
                      thread={thread}
                      collapsed={expandedThreadId !== thread.id}
                      showUnreadMarker={resolvedThreads.length > 1}
                      onToggle={() => toggleThread(thread.id)}
                      onReply={() => setExpandedThreadId(thread.id)}
                      markReadWhenHighlighted={markReadWhenHighlighted}
                      onResolve={() => postUpdateThreadMessage({threadId: thread.id, resolved: false})}
                      onClick={onThreadClick && (() => onThreadClick(thread))}
                      highlighted={isHighlighted(thread)}
                      interactive={!restrictInteractionsToHighlighted || isHighlighted(thread)} />
            ))}
          </div>}
      </div>
    </CommentThreadReadsSnapshot>
  );
}

function useThreadsByResolution({
  subjectType, subjectId, subjectRange, filter, resolution, pickedThreadId
}) {
  const allActiveThreads =
    useLocatedCommentThreadsForSubject({subjectType, subjectId, subjectRange, resolution: 'unresolved'});
  const allResolvedThreads =
    useLocatedCommentThreadsForSubject({subjectType, subjectId, subjectRange, resolution: 'resolved'});

  const activeThreads = useMemo(
    () => (filter ? allActiveThreads.filter(filter) : allActiveThreads),
    [allActiveThreads, filter]
  );

  const resolvedThreads = useMemo(() => {
    const threads = filter ? allResolvedThreads.filter(filter) : allResolvedThreads;

    return resolution === 'unresolved' ?
           threads.filter(thread => thread.id === pickedThreadId) :
           threads;
  }, [allResolvedThreads, filter, resolution, pickedThreadId]);

  return {activeThreads, resolvedThreads};
}

function soleThread(threads) {
  return threads.length === 1 ? threads[0] : undefined;
}
