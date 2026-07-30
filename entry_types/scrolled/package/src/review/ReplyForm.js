import React, {useState} from 'react';

import {useI18n} from '../frontend/i18n';
import {postCreateCommentMessage} from './postMessage';
import {useSubjectQuote} from './subjectQuote';
import {autoGrow, autoResize} from './autoGrow';
import {isSubmitShortcut} from './submitShortcut';

import SendIcon from './images/send.svg';
import styles from './ReplyForm.module.css';

export function ReplyForm({threadId, subjectType, subjectId, subjectRange}) {
  const {t} = useI18n({locale: 'ui'});
  const [body, setBody] = useState('');
  const hasText = body.trim().length > 0;

  // Each reply records the wording it responds to, so a thread spanning
  // several edits keeps every comment next to its own version of the text.
  const quote = useSubjectQuote({subjectType, subjectId, subjectRange});

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
    if (!hasText) return;

    postCreateCommentMessage({threadId, body, quote});
    setBody('');
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <textarea className={styles.input}
                ref={autoResize}
                value={body}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder={t('pageflow_scrolled.review.reply_placeholder')}
                rows={1} />
      {hasText &&
        <div className={styles.actions}>
          <span className={styles.hint}>
            {t('pageflow_scrolled.review.enter_for_new_line')}
          </span>
          <button className={styles.submitButton}
                  type="submit"
                  aria-label={t('pageflow_scrolled.review.send')}>
            <SendIcon /> {t('pageflow_scrolled.review.send')}
          </button>
        </div>}
    </form>
  );
}
