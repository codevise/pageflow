import React from 'react';
import classNames from 'classnames';
import {
  EditableText,
  useContentElementConfigurationUpdate,
  useContentElementEditorState,
  useI18n,
  useTheme,
  utils,
  paletteColor
} from 'pageflow-scrolled/frontend';

import styles from './Quote.module.css';

export function Quote({configuration, contentElementId, sectionProps}) {
  const updateConfiguration = useContentElementConfigurationUpdate();
  const {isSelected} = useContentElementEditorState();
  const theme = useTheme();
  const {t} = useI18n({locale: 'ui'});

  const design = configuration.variant ? configuration.variant.split('-')[0] : theme.options.quoteDesign;

  return (
    <figure className={classNames(styles.figure,
                                  styles[`design-${design || 'largeHanging'}`],
                                  `scope-quote-${configuration.variant}`,
                                  {[styles.maskedMark]: theme.options.properties?.root?.quoteLeftMarkMaskImage},
                                  {[styles.centerRagged]: sectionProps.layout === 'centerRagged'})}
            style={{'--palette-color': paletteColor(configuration.color)}}>
      <blockquote className={styles.text}>
        <EditableText value={configuration.text}
                      contentElementId={contentElementId}
                      onChange={text => updateConfiguration({text})}
                      onlyParagraphs={true}
                      scaleCategory={getTextScaleCategory(configuration, 'Text')} />
      </blockquote>

      {(isSelected || !utils.isBlankEditableTextValue(configuration.attribution || [])) &&
       <figcaption className={styles.attribution}>
         <EditableText value={configuration.attribution}
                       contentElementId={contentElementId}
                       onChange={attribution => updateConfiguration({attribution})}
                       onlyParagraphs={true}
                       scaleCategory={getTextScaleCategory(configuration, 'Attribution')}
                       placeholder={t('pageflow_scrolled.inline_editing.type_attribution')} />
       </figcaption>}
    </figure>
  );
}

function getTextScaleCategory(configuration, suffix) {
  const base = `quote${suffix}`;

  switch (configuration.textSize) {
    case 'large':
      return `${base}-lg`;
    case 'small':
      return `${base}-sm`;
    case 'verySmall':
      return `${base}-xs`;
    default:
      return `${base}-md`;
  }
}
