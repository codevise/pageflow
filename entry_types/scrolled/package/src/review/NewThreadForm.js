import React, {useState} from 'react';

import {useI18n} from '../frontend/i18n';
import {postCreateCommentThreadMessage} from './postMessage';
import {autoGrow, autoResize} from './autoGrow';

import SendIcon from './images/send.svg';
import styles from './NewThreadForm.module.css';

export function NewThreadForm({subjectType, subjectId, onSubmit, onCancel}) {
  const {t} = useI18n({locale: 'ui'});
  const [body, setBody] = useState('');

  function handleChange(e) {
    setBody(e.target.value);
    autoGrow(e.target);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!body.trim()) return;

    postCreateCommentThreadMessage({subjectType, subjectId, body});
    setBody('');

    if (onSubmit) onSubmit();
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <textarea className={styles.input}
                ref={autoResize}
                value={body}
                onChange={handleChange}
                placeholder={t('pageflow_scrolled.review.add_comment_placeholder')}
                rows={3} />
      <div className={styles.actions}>
        {onCancel &&
          <button className={styles.cancelButton}
                  type="button"
                  onClick={onCancel}>
            {t('pageflow_scrolled.review.cancel')}
          </button>}
        <button className={styles.submitButton}
                type="submit">
          <SendIcon /> {t('pageflow_scrolled.review.send')}
        </button>
      </div>
    </form>
  );
}
