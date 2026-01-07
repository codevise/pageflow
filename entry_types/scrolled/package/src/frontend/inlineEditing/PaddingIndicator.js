import React from 'react';
import classNames from 'classnames';

import {useTheme} from '../../entryState';
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

export function PaddingIndicator({section, motifAreaState, paddingValue, position}) {
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
                      getPaddingText({theme, paddingValue, position, t});

  if (isSectionSelected || isPaddingSelected) {
    return (
      <div aria-label={t(`pageflow_scrolled.inline_editing.edit_section_padding_${position}`)}
           className={classNames(styles[`indicator-${position}`],
                                 {[styles.selected]: isPaddingSelected,
                                  [styles.motif]: motifPadding,
                                  [styles.none]: !motifPadding && paddingValue === 'none'})}
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

function getPaddingText({theme, paddingValue, position, t}) {
  if (!paddingValue) {
    return t('pageflow_scrolled.inline_editing.default_padding');
  }

  const scaleTranslations = theme.translations?.scales || {};
  const scaleName = scaleNames[position];

  return scaleTranslations[scaleName]?.[paddingValue];
}
