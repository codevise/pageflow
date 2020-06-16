import React, {useState} from 'react';
import classNames from 'classnames';

import {useI18n} from '../i18n';

import PlusIcon from './images/plus.svg';

import styles from './ContentElementInsertButton.module.css';

export function ContentElementInsertButton({onClick}) {
  const [hovered, setHovered] = useState();
  const {t} = useI18n({locale: 'ui'});

  return (
    <div className={classNames(styles.container, {[styles.hovered]: hovered})}>
      <button className={styles.button}
              title={t('pageflow_scrolled.inline_editing.add_content_element')}
              onClick={onClick}
              onMouseDown={event => event.stopPropagation()}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}>
        <PlusIcon width={15} height={15} fill="currentColor"/>
      </button>
    </div>
  );
}
