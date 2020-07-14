import React, {useState, useLayoutEffect, useRef} from 'react';

import {useI18n} from '../../i18n';

import styles from './index.module.css';

import CancelIcon from '../images/cancel.svg';

export function LinkInput({onSubmit, onCancel}) {
  const {t} = useI18n({locale: 'ui'});
  const [href, setHref] = useState('')
  const ref = useRef();

  // With useEffect the deselect in HoveringToolbar/handleButtonClick breaks focusing.
  useLayoutEffect(() => {
    ref.current.focus();
  }, []);

  function handleKey(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      ref.current.blur();
    }
    else if (event.key === 'Escape') {
      event.preventDefault();
      onCancel();
    }
  }

  function submit() {
    if (href) {
      onSubmit(href);
    }
    else {
      onCancel();
    }
  }

  return (
    <div className={styles.linkTooltip}>
      <input ref={ref}
             type="text"
             value={href}
             placeholder={t('pageflow_scrolled.inline_editing.url_placeholder')}
             onBlur={submit}
             onChange={e => setHref(e.target.value)}
             onKeyDown={handleKey}/>
      <button onMouseDown={e => e.preventDefault()}
              onClick={onCancel}
              title={t('pageflow_scrolled.inline_editing.cancel')}>
        <CancelIcon width={10} height={10} />
      </button>
    </div>
  );
}
