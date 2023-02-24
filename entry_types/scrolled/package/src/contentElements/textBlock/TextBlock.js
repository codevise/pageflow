import React from 'react';
import classNames from 'classnames';
import {
  EditableText,
  useContentElementConfigurationUpdate,
  useI18n,
  useTheme
} from 'pageflow-scrolled/frontend';

import styles from './TextBlock.module.css';

export function TextBlock(props) {
  const updateConfiguration = useContentElementConfigurationUpdate();
  const {t} = useI18n({locale: 'ui'});
  const theme = useTheme();

  const className = classNames(styles.text,
                               styles[`quoteDesign-${theme.options.quoteDesign || 'largeHanging'}`],
                               styles[`layout-${props.sectionProps.layout}`]);
  return (
    <EditableText value={props.configuration.value}
                  contentElementId={props.contentElementId}
                  className={className}
                  selectionRect={true}
                  placeholder={t('pageflow_scrolled.inline_editing.type_text')}
                  onChange={value => updateConfiguration({value})} />
  );
}
