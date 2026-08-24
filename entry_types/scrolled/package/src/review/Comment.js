import React, {useCallback, useState} from 'react';

import {useI18n, useLocale} from 'pageflow-scrolled/frontend';
import {Avatar} from './Avatar';
import {CommentMenu} from './CommentMenu';
import {useCurrentUser, useUpdateComment} from './ReviewStateProvider';
import {autoGrow, autoResize} from './autoGrow';
import {formatDate, formatDateTime} from './formatDate';
import {isSubmitShortcut} from './submitShortcut';

import EditIcon from './images/edit.svg';
import styles from './Comment.module.css';

export function Comment({comment, threadId, showQuote, editing, onEdit, onEditEnd}) {
  const {t} = useI18n({locale: 'ui'});
  const locale = useLocale({locale: 'ui'});
  const currentUser = useCurrentUser();

  const editable = !!onEdit && comment.creatorId === currentUser?.id;

  return (
    <div>
      <div className={styles.header}>
        <Avatar name={comment.creatorName} />
        <div className={styles.headerText}>
          <span className={styles.author}>{comment.creatorName}</span>
          {comment.createdAt &&
            <time className={styles.timestamp} dateTime={comment.createdAt}>
              {formatDate(comment.createdAt, locale)}
            </time>}
        </div>
        {editable &&
          <span className={styles.headerMenu}>
            <CommentMenu label={t('pageflow_scrolled.review.comment_actions')}
                         items={[{icon: EditIcon,
                                  label: t('pageflow_scrolled.review.edit_comment'),
                                  onSelect: onEdit}]} />
          </span>}
      </div>
      {showQuote &&
        <blockquote className={styles.quote}>{comment.quote}</blockquote>}
      {editing
        ? <EditForm comment={comment} threadId={threadId} onDone={onEditEnd} />
        : <>
            <p className={styles.body}>{comment.body}</p>
            {comment.editedAt &&
              <p className={styles.editedHint}>
                {t('pageflow_scrolled.review.edited',
                   {date: formatDateTime(comment.editedAt, locale)})}
              </p>}
          </>}
    </div>
  );
}

function EditForm({comment, threadId, onDone}) {
  const {t} = useI18n({locale: 'ui'});

  const [body, setBody] = useState(comment.body);
  const hasText = body.trim().length > 0;

  const updateComment = useUpdateComment({threadId, commentId: comment.id});

  // preventScroll keeps focus from yanking the page to the top before the
  // portaled popover has been positioned by floating-ui.
  const setInputRef = useCallback(node => {
    autoResize(node);
    node?.focus({preventScroll: true});
  }, []);

  function handleChange(e) {
    setBody(e.target.value);
    autoGrow(e.target);
  }

  function handleSubmit(event) {
    event.preventDefault();
    save();
  }

  function handleKeyDown(event) {
    if (isSubmitShortcut(event)) {
      event.preventDefault();
      save();
    }
  }

  // The thread keeps showing the previous text until the session reports
  // the comment back, so there is nothing to restore on failure.
  function save() {
    if (!hasText) return;

    updateComment(body);
    onDone();
  }

  return (
    <form className={styles.editForm} onSubmit={handleSubmit}>
      <textarea className={styles.editInput}
                ref={setInputRef}
                value={body}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                rows={1} />
      <div className={styles.editActions}>
        <button className={styles.cancelButton} type="button" onClick={onDone}>
          {t('pageflow_scrolled.review.cancel')}
        </button>
        <button className={styles.saveButton} type="submit" disabled={!hasText}>
          {t('pageflow_scrolled.review.save')}
        </button>
      </div>
    </form>
  );
}
