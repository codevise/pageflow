import React from 'react';
import classNames from 'classnames';

import {useI18n} from '../i18n';
import styles from './InsertContentElementIndicator.module.css';
import PlusIcon from './images/plus.svg';

export function InsertContentElementIndicator({contentElementId, selected, position}) {
  const {t} = useI18n({locale: 'ui'});

  function handleClick(event) {
    window.parent.postMessage(
      {
        type: 'INSERT_CONTENT_ELEMENT',
        payload: {
          id: contentElementId,
          position
        }
      },
      window.location.origin
    );

    event.stopPropagation();
  }

  return (
    <div className={classNames(styles.root,
                               styles[position])}
         title={t('pageflow_scrolled.inline_editing.insert_content_element')}
         onClick={handleClick}>
      <div className={styles.box}>
        <PlusIcon width={20} height={20} fill="currentColor" />
      </div>
      <div className={styles.left} />
      <div className={styles.right} />
      <div className={styles.middle} />
    </div>
  );
}
