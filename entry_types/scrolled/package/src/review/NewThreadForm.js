import React, {useCallback, useState} from 'react';

import {useI18n} from '../frontend/i18n';
import {postCreateCommentThreadMessage} from './postMessage';
import {autoGrow, autoResize} from './autoGrow';
import {isSubmitShortcut} from './submitShortcut';

import SendIcon from './images/send.svg';
import styles from './NewThreadForm.module.css';

export function NewThreadForm({subjectType, subjectId, subjectRange, onSubmit, onCancel}) {
  const {t} = useI18n({locale: 'ui'});
  const [body, setBody] = useState('');
  const hasText = body.trim().length > 0;

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
    createThread();
  }

  function handleKeyDown(event) {
    if (isSubmitShortcut(event)) {
      event.preventDefault();
      createThread();
    }
  }

  function createThread() {
    if (!hasText) return;

    postCreateCommentThreadMessage({subjectType, subjectId, subjectRange, body});
    setBody('');

    if (onSubmit) onSubmit();
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <textarea className={styles.input}
                ref={setInputRef}
                value={body}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder={t('pageflow_scrolled.review.add_comment_placeholder')}
                rows={3} />
      <div className={styles.actions}>
        {hasText &&
          <span className={styles.hint}>
            {t('pageflow_scrolled.review.enter_for_new_line')}
          </span>}
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
