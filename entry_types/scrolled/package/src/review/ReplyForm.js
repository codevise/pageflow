import React from 'react';

import {useI18n} from '../frontend/i18n';
import {useCreateComment} from './ReviewStateProvider';
import {useDraftedBody} from './useDraftedBody';
import {autoGrow, autoResize} from './autoGrow';
import {isSubmitShortcut} from './submitShortcut';

import SendIcon from './images/send.svg';
import SpinnerIcon from '../frontend/icons/spinner.svg';
import styles from './ReplyForm.module.css';

export function ReplyForm({threadId, subjectType, subjectId, subjectRange}) {
  const {t} = useI18n({locale: 'ui'});

  const {body, setBody, submitting} = useDraftedBody({threadId});
  const hasText = body.trim().length > 0;

  const createComment = useCreateComment({
    threadId, subjectType, subjectId, subjectRange
  });

  function handleChange(e) {
    setBody(e.target.value);
    autoGrow(e.target);
  }

  function handleSubmit(event) {
    event.preventDefault();
    createReply();
  }

  function handleKeyDown(event) {
    if (isSubmitShortcut(event)) {
      event.preventDefault();
      createReply();
    }
  }

  function createReply() {
    if (!hasText || submitting) return;

    createComment(body);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} aria-busy={submitting}>
      <textarea className={styles.input}
                ref={autoResize}
                value={body}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder={t('pageflow_scrolled.review.reply_placeholder')}
                disabled={submitting}
                rows={1} />
      {hasText &&
        <div className={styles.actions}>
          {!submitting &&
            <span className={styles.hint}>
              {t('pageflow_scrolled.review.enter_for_new_line')}
            </span>}
          <button className={styles.submitButton}
                  type="submit"
                  disabled={submitting}
                  aria-label={t('pageflow_scrolled.review.send')}>
            {submitting ? <SpinnerIcon className={styles.spinner} /> : <SendIcon />}
            {t('pageflow_scrolled.review.send')}
          </button>
        </div>}
    </form>
  );
}
