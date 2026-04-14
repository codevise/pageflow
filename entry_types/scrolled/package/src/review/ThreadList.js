import React, {useState} from 'react';
import classNames from 'classnames';

import {useI18n} from '../frontend/i18n';
import {useCommentThreads} from './ReviewStateProvider';
import {Thread} from './Thread';
import {NewThreadForm} from './NewThreadForm';

import NewTopicIcon from './images/newTopic.svg';
import styles from './ThreadList.module.css';

export function ThreadList({subjectType, subjectId, showNewForm: showNewFormProp, reversed, onDismiss, newTopicButtonClassName}) {
  const {t} = useI18n({locale: 'ui'});
  const threads = useCommentThreads(subjectType, subjectId);
  const [expandedThreadId, setExpandedThreadId] = useState(null);
  const [formToggled, setFormToggled] = useState(null);
  const showNewForm = formToggled !== null ? formToggled : (showNewFormProp || threads.length === 0);

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
                       onSubmit={() => setFormToggled(false)}
                       onCancel={() => {
                         setFormToggled(false);
                         if (threads.length === 0 && onDismiss) onDismiss();
                       }} />}

      {threads.map(thread => (
        <Thread key={thread.id}
                thread={thread}
                collapsed={threads.length > 1 && expandedThreadId !== thread.id}
                onToggle={() => toggleThread(thread.id)} />
      ))}
    </div>
  );
}
