import React from 'react';
import classNames from 'classnames';
import {
  EditableText,
  useContentElementConfigurationUpdate,
  useContentElementEditorState,
  useI18n,
  useTheme
} from 'pageflow-scrolled/frontend';

import styles from './Quote.module.css';

export function Quote({configuration, contentElementId, sectionProps}) {
  const updateConfiguration = useContentElementConfigurationUpdate();
  const {isSelected} = useContentElementEditorState();
  const theme = useTheme();
  const {t} = useI18n({locale: 'ui'});

  return (
    <figure className={classNames(styles.figure,
                                  styles[`design-${theme.options.quoteDesign || 'largeHanging'}`],
                                  {[styles.centerRagged]: sectionProps.layout === 'centerRagged'})}>
      <blockquote className={styles.text}>
        <EditableText value={configuration.text}
                      contentElementId={contentElementId}
                      onChange={text => updateConfiguration({text})}
                      onlyParagraphs={true}
                      scaleCategory={getTextScaleCategory(configuration)} />
      </blockquote>

      {(isSelected || !isBlank(configuration.attribution || [])) &&
       <figcaption className={styles.attribution}>
         <EditableText value={configuration.attribution}
                       contentElementId={contentElementId}
                       onChange={attribution => updateConfiguration({attribution})}
                       onlyParagraphs={true}
                       scaleCategory="quoteAttribution"
                       placeholder={t('pageflow_scrolled.inline_editing.type_attribution')} />
       </figcaption>}
    </figure>
  );
}

function getTextScaleCategory(configuration) {
  switch (configuration.textSize) {
    case 'large':
      return 'quoteText-lg';
    case 'small':
      return 'quoteText-sm';
    default:
      return 'quoteText-md';
  }
}

function isBlank(value) {
  return value.length <= 1 &&
         value[0]?.children.length <= 1 &&
         !value[0]?.children[0]?.text;
}
