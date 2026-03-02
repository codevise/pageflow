import React from 'react';

import {useTheme} from '../../entryState';
import {Scale} from '../../shared/Scale';
import {useContentElementEditorState} from '../useContentElementEditorState';
import {useI18n} from '../i18n';

import styles from './MarginIndicator.module.css';

export function MarginIndicator({marginValue, position}) {
  const {isSelected} = useContentElementEditorState();
  const theme = useTheme();
  const {t} = useI18n({locale: 'ui'});

  const scale = Scale({
    scaleName: 'contentElementMargin',
    themeProperties: theme.options?.properties || {},
    scaleTranslations: theme.translations?.scales || {},
    defaultValuePropertyName: 'contentElementMarginStyleDefault'
  });

  const index = scale.values.indexOf(marginValue);

  if (!isSelected || !marginValue || index < 0) {
    return null;
  }

  const label = t(`pageflow_scrolled.inline_editing.content_element_margin_${position}`);

  return (
    <div aria-label={label}
         className={styles[`indicator-${position}`]}
         style={{'--indicator-height': `var(--theme-content-element-margin-${marginValue})`}}>
      <div className={styles.tooltip}
           title={label}>
        {scale.texts[index]}
      </div>
    </div>
  );
}
