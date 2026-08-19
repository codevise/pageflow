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

export function ThreadList({subjectType, subjectId, subjectRange, filter, highlightedThreadId, onThreadClick, restrictInteractionsToHighlighted, showNewForm: showNewFormProp, hideNewTopicButton, reversed, expandResolved}) {
  const {t} = useI18n({locale: 'ui'});

  // Threads arrive already located: in display order, with orphans of
  // deleted content elements folded into their section on top and flagged.
  // The list only filters by the selection and splits resolved from active.
  const allActiveThreads =
    useLocatedCommentThreadsForSubject({subjectType, subjectId, subjectRange, resolution: 'unresolved'});
  const allResolvedThreads =
    useLocatedCommentThreadsForSubject({subjectType, subjectId, subjectRange, resolution: 'resolved'});

  const activeThreads = useMemo(
    () => (filter ? allActiveThreads.filter(filter) : allActiveThreads),
    [allActiveThreads, filter]
  );
  const resolvedThreads = useMemo(
    () => (filter ? allResolvedThreads.filter(filter) : allResolvedThreads),
    [allResolvedThreads, filter]
  );

  const isHighlighted = thread => Array.isArray(highlightedThreadId) ?
                                  highlightedThreadId.includes(thread.id) :
                                  thread.id === highlightedThreadId;

  const noThreads = activeThreads.length === 0 && resolvedThreads.length === 0;

  const [draft] = useCommentDraft({subjectType, subjectId});
  const [expandedThreadId, setExpandedThreadId] = useState(null);
  const [resolvedToggled, setResolvedToggled] = useState(null);
  const [formToggled, setFormToggled] = useState(
    showNewFormProp !== undefined ? showNewFormProp :
    expandResolved ? noThreads : activeThreads.length === 0
  );

  const showResolved = resolvedToggled !== null ? resolvedToggled : !!expandResolved;

  // An unsent draft reopens the form and keeps it open while the thread is
  // being created. Callers passing showNewForm={false} suppress the form
  // entirely: the editor sidebar lists compose new threads in a view of
  // their own.
  const showNewForm = showNewFormProp !== false && (!!draft || formToggled);

  function toggleThread(threadId) {
    setExpandedThreadId(expandedThreadId === threadId ? null : threadId);
  }

  return (
    <CommentThreadReadsSnapshot>
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
                  collapsed={activeThreads.length > 1 && expandedThreadId !== thread.id}
                  onToggle={() => toggleThread(thread.id)}
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
                      collapsed={resolvedThreads.length > 1 && expandedThreadId !== thread.id}
                      onToggle={() => toggleThread(thread.id)}
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
