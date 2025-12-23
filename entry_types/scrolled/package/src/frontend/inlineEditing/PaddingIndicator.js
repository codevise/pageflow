import React from 'react';
import classNames from 'classnames';

import {useTheme} from '../../entryState';
import {Scale} from '../../shared/Scale';
import {useEditorSelection} from './EditorState';
import {useI18n} from '../i18n';

import styles from './PaddingIndicator.module.css';

import paddingTopIcon from './images/paddingTop.svg';
import paddingBottomIcon from './images/paddingBottom.svg';

const paddingIcons = {
  top: paddingTopIcon,
  bottom: paddingBottomIcon
};

const scaleNames = {
  top: 'sectionPaddingTop',
  bottom: 'sectionPaddingBottom'
};

const scaleDefaultPropertyNames = {
  sectionPaddingTop: 'sectionDefaultPaddingTop',
  sectionPaddingBottom: 'sectionDefaultPaddingBottom'
};

export function PaddingIndicator({section, motifAreaState, paddingValue, position, suppressed}) {
  const Icon = paddingIcons[position];
  const theme = useTheme();
  const {t} = useI18n({locale: 'ui'});

  const {isSelected: isSectionSelected} = useEditorSelection({
    id: section.id,
    type: 'sectionSettings'
  });

  const {isSelected: isPaddingSelected, select} = useEditorSelection({
    id: section.id,
    type: 'sectionPaddings',
    position
  });

  const motifPadding = motifAreaState?.paddingTop > 0;
  const paddingText = motifPadding ?
                      t('pageflow_scrolled.inline_editing.expose_motif_area') :
                      getPaddingText({theme, paddingValue, position, t, suppressed});

  if (isSectionSelected || isPaddingSelected) {
    return (
      <div aria-label={t(`pageflow_scrolled.inline_editing.edit_section_padding_${position}`)}
           className={classNames(styles[`indicator-${position}`],
                                 {[styles.selected]: isPaddingSelected,
                                  [styles.motif]: motifPadding,
                                  [styles.none]: !motifPadding && (paddingValue === 'none' || suppressed)})}
           onClick={() => select()}>
        <div className={styles.tooltip}>
          <Icon />
          {paddingText}
        </div>
      </div>
    );
  }
  else {
    return null;
  }
}

function getPaddingText({theme, paddingValue, position, t, suppressed}) {
  if (suppressed) {
    const key = position === 'top' ?
                'pageflow_scrolled.inline_editing.padding_suppressed_before_full_width' :
                'pageflow_scrolled.inline_editing.padding_suppressed_after_full_width';
    return t(key);
  }

  const scaleName = scaleNames[position];
  const scale = Scale({
    scaleName,
    themeProperties: theme.options?.properties || {},
    scaleTranslations: theme.translations?.scales || {},
    defaultValuePropertyName: scaleDefaultPropertyNames[scaleName]
  });

  const value = paddingValue || scale.defaultValue;
  const index = scale.values.indexOf(value);

  return scale.texts[index];
}
