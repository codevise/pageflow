import React from 'react';

import {useLocale} from 'pageflow-scrolled/frontend';
import {Avatar} from './Avatar';

import styles from './Comment.module.css';

export function Comment({comment, showQuote}) {
  const locale = useLocale({locale: 'ui'});

  return (
    <div className={styles.comment}>
      <div className={styles.header}>
        <Avatar name={comment.creatorName} />
        <span className={styles.author}>{comment.creatorName}</span>
        {comment.createdAt &&
          <time className={styles.timestamp} dateTime={comment.createdAt}>
            {formatDate(comment.createdAt, locale)}
          </time>}
      </div>
      {showQuote &&
        <blockquote className={styles.quote}>{comment.quote}</blockquote>}
      <p className={styles.body}>{comment.body}</p>
    </div>
  );
}

function formatDate(isoString, locale) {
  const date = new Date(isoString);
  const fromCurrentYear = date.getFullYear() === new Date().getFullYear();

  return date.toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
    ...(!fromCurrentYear && {year: 'numeric'})
  });
}
