import React, {useState} from 'react';

import {useI18n} from '../frontend/i18n';
import {postCreateCommentMessage} from './postMessage';
import {autoGrow, autoResize} from './autoGrow';

import SendIcon from './images/send.svg';
import styles from './ReplyForm.module.css';

export function ReplyForm({threadId}) {
  const {t} = useI18n({locale: 'ui'});
  const [body, setBody] = useState('');
  const hasText = body.trim().length > 0;

  function handleChange(e) {
    setBody(e.target.value);
    autoGrow(e.target);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!hasText) return;

    postCreateCommentMessage({threadId, body});
    setBody('');
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <textarea className={styles.input}
                ref={autoResize}
                value={body}
                onChange={handleChange}
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
