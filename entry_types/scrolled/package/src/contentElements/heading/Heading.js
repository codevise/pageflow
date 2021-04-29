import React from 'react';
import classNames from 'classnames';
import {
  withShadowClassName,
  Text,
  EditableInlineText,
  useContentElementConfigurationUpdate,
  useI18n
} from 'pageflow-scrolled/frontend';

import styles from './Heading.module.css';

export function Heading({configuration, sectionProps}) {
  const level = configuration.level || sectionProps.sectionIndex;
  const firstSectionInEntry = level === 0;
  const updateConfiguration = useContentElementConfigurationUpdate();
  const {t} = useI18n({locale: 'ui'});

  const legacyValue = configuration.children;

  return (
    <h1 className={classNames(styles.root,
                              {[styles.first]: firstSectionInEntry},
                              {[styles[sectionProps.layout]]: configuration.position === 'wide'},
                              {[withShadowClassName]: !sectionProps.invert})}>
      <Text scaleCategory={firstSectionInEntry ? 'h1' : 'h2'} inline={true}>
        <EditableInlineText value={configuration.value}
                            defaultValue={legacyValue}
                            placeholder={firstSectionInEntry ?
                                         t('pageflow_scrolled.inline_editing.type_title') :
                                         t('pageflow_scrolled.inline_editing.type_heading')}
                            onChange={value => updateConfiguration({value})} />
      </Text>
    </h1>
  );
}
