import React from 'react';

import {Avatar} from './Avatar';

import styles from './Comment.module.css';

export function Comment({comment, showQuote}) {
  return (
    <div className={styles.comment}>
      <div className={styles.header}>
        <Avatar name={comment.creatorName} />
        <span className={styles.author}>{comment.creatorName}</span>
        {comment.createdAt &&
          <time className={styles.timestamp}>{formatDate(comment.createdAt)}</time>}
      </div>
      {showQuote &&
        <blockquote className={styles.quote}>{comment.quote}</blockquote>}
      <p className={styles.body}>{comment.body}</p>
    </div>
  );
}

function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
}
