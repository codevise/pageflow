import React, {useCallback, useEffect, useRef, useState} from 'react';

import {useI18n} from '../frontend/i18n';
import {useCommentDraft, useCreateCommentThread} from './ReviewStateProvider';
import {autoGrow, autoResize} from './autoGrow';
import {isSubmitShortcut} from './submitShortcut';

import SendIcon from './images/send.svg';
import SpinnerIcon from '../frontend/icons/spinner.svg';
import styles from './NewThreadForm.module.css';

export function NewThreadForm({subjectType, subjectId, subjectRange, onSubmit}) {
  const {t} = useI18n({locale: 'ui'});

  const {body, setBody, submitting} = useDraftedBody({subjectType, subjectId});
  const hasText = body.trim().length > 0;

  const createCommentThread = useCreateCommentThread({
    subjectType, subjectId, subjectRange
  });

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
    if (!hasText || submitting) return;

    createCommentThread(body);

    if (onSubmit) onSubmit();
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} aria-busy={submitting}>
      <textarea className={styles.input}
                ref={setInputRef}
                value={body}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder={t('pageflow_scrolled.review.add_comment_placeholder')}
                disabled={submitting}
                rows={3} />
      <div className={styles.actions}>
        {hasText && !submitting &&
          <span className={styles.hint}>
            {t('pageflow_scrolled.review.enter_for_new_line')}
          </span>}
        <button className={styles.submitButton}
                type="submit"
                disabled={submitting}>
          {submitting ? <SpinnerIcon className={styles.spinner} /> : <SendIcon />}
          {t('pageflow_scrolled.review.send')}
        </button>
      </div>
    </form>
  );
}

// Storing the draft only once the form goes away is deliberate: whether a
// draft exists decides whether the thread list keeps the form open, which
// would otherwise make the form disappear from under a reviewer clearing
// the text to start over.
function useDraftedBody({subjectType, subjectId}) {
  const [draft, setDraft] = useCommentDraft({subjectType, subjectId});

  // Read when mounting only: echoing the stored draft back into the
  // textarea would make its value lag behind typing.
  const [body, setBody] = useState(() => draft?.body || '');
  const pending = !!draft?.pending;

  const latest = useRef();
  latest.current = {body, pending, setDraft};

  useEffect(() => () => {
    const {body, pending, setDraft} = latest.current;

    // The session drops the draft it created the thread from, so storing
    // the text of a pending draft here would resurrect it. A failed
    // attempt leaves a draft that is no longer pending.
    if (pending) return;

    setDraft(body);
  }, []);

  return {body, setBody, submitting: pending};
}
