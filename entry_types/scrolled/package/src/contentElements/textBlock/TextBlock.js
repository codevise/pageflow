import React from 'react';
import {
  EditableText,
  useContentElementConfigurationUpdate,
  useI18n
} from 'pageflow-scrolled/frontend';

import styles from './TextBlock.module.css';

export function TextBlock(props) {
  const updateConfiguration = useContentElementConfigurationUpdate();
  const {t} = useI18n({locale: 'ui'});

  return (
    <div className={styles.text}>
      <EditableText value={props.configuration.value}
                    contentElementId={props.contentElementId}
                    placeholder={t('pageflow_scrolled.inline_editing.type_text')}
                    onChange={value => updateConfiguration({value})} />
    </div>
  );
}
