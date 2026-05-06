import React, {useMemo, useState} from 'react';
import classNames from 'classnames';

import {useI18n} from '../frontend/i18n';
import {useCommentThreads} from './ReviewStateProvider';
import {Thread} from './Thread';
import {NewThreadForm} from './NewThreadForm';
import {postUpdateThreadMessage} from './postMessage';

import ChevronIcon from './images/chevron.svg';
import NewTopicIcon from './images/newTopic.svg';
import styles from './ThreadList.module.css';

export function ThreadList({subjectType, subjectId, subjectRange, filter, highlightedThreadId, onThreadClick, showNewForm: showNewFormProp, hideNewTopicButton, reversed, onDismiss, newTopicButtonClassName}) {
  const {t} = useI18n({locale: 'ui'});
  const allActiveThreads = useCommentThreads({subjectType, subjectId, subjectRange}, {resolved: false});
  const allResolvedThreads = useCommentThreads({subjectType, subjectId, subjectRange}, {resolved: true});

  const activeThreads = useMemo(
    () => filter ? allActiveThreads.filter(filter) : allActiveThreads,
    [allActiveThreads, filter]
  );
  const resolvedThreads = useMemo(
    () => filter ? allResolvedThreads.filter(filter) : allResolvedThreads,
    [allResolvedThreads, filter]
  );

  const [expandedThreadId, setExpandedThreadId] = useState(null);
  const [formToggled, setFormToggled] = useState(null);
  const [showResolved, setShowResolved] = useState(false);
  const showNewForm = formToggled !== null ? formToggled :
                      showNewFormProp !== undefined ? showNewFormProp :
                      activeThreads.length === 0;

  function toggleThread(threadId) {
    setExpandedThreadId(expandedThreadId === threadId ? null : threadId);
  }

  return (
    <div className={styles.container}>
      {!showNewForm && !hideNewTopicButton &&
        <button className={classNames(styles.newTopicButton,
                                      newTopicButtonClassName,
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
                       onSubmit={() => setFormToggled(false)}
                       onCancel={() => {
                         setFormToggled(false);
                         if (activeThreads.length === 0 && onDismiss) onDismiss();
                       }} />}

      {activeThreads.map(thread => (
        <Thread key={thread.id}
                thread={thread}
                collapsed={activeThreads.length > 1 && expandedThreadId !== thread.id}
                onToggle={() => toggleThread(thread.id)}
                onResolve={() => postUpdateThreadMessage({threadId: thread.id, resolved: true})}
                onClick={onThreadClick && (() => onThreadClick(thread))}
                highlighted={thread.id === highlightedThreadId} />
      ))}

      {resolvedThreads.length > 0 &&
        <div className={styles.resolvedSection}>
          <button className={styles.resolvedPill}
                  onClick={() => setShowResolved(!showResolved)}>
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
                    highlighted={thread.id === highlightedThreadId} />
          ))}
        </div>}
    </div>
  );
}
