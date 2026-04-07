import React, {useState} from 'react';

import {useCommentThreads} from './ReviewStateProvider';
import {Thread} from './Thread';

import styles from './ThreadList.module.css';

export function ThreadList({subjectType, subjectId}) {
  const threads = useCommentThreads(subjectType, subjectId);
  const [expandedThreadId, setExpandedThreadId] = useState(null);

  function toggleThread(threadId) {
    setExpandedThreadId(expandedThreadId === threadId ? null : threadId);
  }

  return (
    <div className={styles.container}>
      {threads.map(thread => (
        <Thread key={thread.id}
                thread={thread}
                collapsed={threads.length > 1 && expandedThreadId !== thread.id}
                onToggle={() => toggleThread(thread.id)} />
      ))}
    </div>
  );
}
