import React, {useState} from 'react';
import classNames from 'classnames';

import {useI18n} from '../frontend/i18n';
import {useCommentThreads} from './ReviewStateProvider';
import {Thread} from './Thread';
import {NewThreadForm} from './NewThreadForm';
import {postUpdateThreadMessage} from './postMessage';

import ChevronIcon from './images/chevron.svg';
import NewTopicIcon from './images/newTopic.svg';
import styles from './ThreadList.module.css';

export function ThreadList({subjectType, subjectId, subjectRange, showNewForm: showNewFormProp, reversed, onDismiss, newTopicButtonClassName}) {
  const {t} = useI18n({locale: 'ui'});
  const threads = useCommentThreads(subjectType, subjectId, subjectRange);

  const activeThreads = threads.filter(thread => !thread.resolvedAt);
  const resolvedThreads = threads.filter(thread => thread.resolvedAt);

  const [expandedThreadId, setExpandedThreadId] = useState(null);
  const [formToggled, setFormToggled] = useState(null);
  const [showResolved, setShowResolved] = useState(false);
  const showNewForm = formToggled !== null ? formToggled : (showNewFormProp || activeThreads.length === 0);

  function toggleThread(threadId) {
    setExpandedThreadId(expandedThreadId === threadId ? null : threadId);
  }

  return (
    <div className={styles.container}>
      {!showNewForm &&
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
                onResolve={() => postUpdateThreadMessage({threadId: thread.id, resolved: true})} />
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
                    onResolve={() => postUpdateThreadMessage({threadId: thread.id, resolved: false})} />
          ))}
        </div>}
    </div>
  );
}
