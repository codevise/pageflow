import React from 'react';
import {EditableText, useContentElementConfigurationUpdate} from 'pageflow-scrolled/frontend';

import styles from './TextBlock.module.css';

export function TextBlock(props) {
  const updateConfiguration = useContentElementConfigurationUpdate();

  return (
    <div className={styles.text}>
      <EditableText value={props.configuration.value}
                    contentElementId={props.contentElementId}
                    onChange={value => updateConfiguration({value})} />
    </div>
  );
}
