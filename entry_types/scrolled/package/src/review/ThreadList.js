import React from 'react';

import {useCommentThreads} from './ReviewStateProvider';

import styles from './ThreadList.module.css';

export function ThreadList({subjectType, subjectId}) {
  const threads = useCommentThreads(subjectType, subjectId);

  return (
    <div className={styles.container}>
      {threads.map(thread => (
        <Thread key={thread.id} thread={thread} />
      ))}
    </div>
  );
}

function Thread({thread}) {
  return (
    <div className={styles.thread}>
      {thread.comments.map(comment => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </div>
  );
}

function Comment({comment}) {
  return (
    <div className={styles.comment}>
      <div className={styles.commentAuthor}>{comment.creatorName}</div>
      <div className={styles.commentBody}>{comment.body}</div>
    </div>
  );
}
