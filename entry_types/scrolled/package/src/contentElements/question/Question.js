import React from 'react';
import classNames from 'classnames';
import {
  EditableInlineText,
  EditableText,
  Text,
  ThemeIcon,
  useContentElementConfigurationUpdate,
  useContentElementEditorState,
  useI18n
} from 'pageflow-scrolled/frontend';

import styles from './Question.module.css';

export function Question({configuration, contentElementId, sectionProps}) {
  const updateConfiguration = useContentElementConfigurationUpdate();
  const {t} = useI18n({locale: 'ui'});

  const {isEditable, isSelected} = useContentElementEditorState();

  return (
    <details open={configuration.expandByDefault || (isEditable && isSelected)}
             className={classNames(styles.details,
                                   styles[`layout-${sectionProps.layout}`])}>
      <summary onClick={isEditable ? event => event.preventDefault() : undefined}>
        <ThemeIcon name="expand" />
        <Text scaleCategory="question"
              typographyVariant={configuration.typographyVariant}
              typographySize={configuration.typographySize}>
          <EditableInlineText value={configuration.question}
                              onChange={question => updateConfiguration({question})}
                              hyphens="none"
                              placeholder={t('pageflow_scrolled.inline_editing.type_question')} />
        </Text>
      </summary>
      <div>
        <EditableText value={configuration.answer}
                      contentElementId={contentElementId}
                      scaleCategory="questionAnswer"
                      typographyVariant={configuration.typographyVariant}
                      typographySize={configuration.typographySize}
                      className={styles.answer}
                      onChange={answer => updateConfiguration({answer})}
                      onlyParagraphs={true}
                      hyphens="none"
                      placeholder={t('pageflow_scrolled.inline_editing.type_answer')} />
      </div>
    </details>
  );
}
