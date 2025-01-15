import React from 'react';
import classNames from 'classnames';

import {
  EditableTable,
  useContentElementConfigurationUpdate,
  useContentElementEditorState,
  useI18n
} from 'pageflow-scrolled/frontend';

import styles from './InfoTable.module.css';

export function InfoTable({configuration, sectionProps}) {
  const {isSelected} = useContentElementEditorState();
  const updateConfiguration = useContentElementConfigurationUpdate();

  const {t} = useI18n({locale: 'ui'});

  return (
    <EditableTable className={classNames(styles.table,
                                         styles[`labelColumnAlign-${configuration.labelColumnAlign}`],
                                         styles[`valueColumnAlign-${configuration.valueColumnAlign}`],
                                         {[styles.selected]: isSelected,
                                          [styles.center]: sectionProps.layout === 'centerRagged'})}
                   labelScaleCategory="infoTableLabel"
                   valueScaleCategory="infoTableValue"
                   labelPlaceholder={t('pageflow_scrolled.inline_editing.type_text')}
                   valuePlaceholder={t('pageflow_scrolled.inline_editing.type_text')}
                   value={configuration.value}
                   onChange={value => updateConfiguration({value})} />
  );
}
