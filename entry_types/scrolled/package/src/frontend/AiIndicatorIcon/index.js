import React from 'react';
import classNames from 'classnames';

import {useI18n} from '../i18n';

import ai from './ai.svg';
import aiGenerated from './aiGenerated.svg';
import aiModified from './aiModified.svg';

import styles from './AiIndicatorIcon.module.css';

const icons = {
  ai,
  ai_generated: aiGenerated,
  ai_modified: aiModified
};

/**
 * Render one of the EU icons for labelling AI generated content.
 *
 * @param {Object} props
 * @param {string} props.kind - Either: ai, ai_generated, ai_modified.
 * @param {string} [props.className]
 */
export function AiIndicatorIcon({kind, className}) {
  const aiIndicatorLabel = useAiIndicatorLabel();
  const Icon = icons[kind];

  if (!Icon) {
    return null;
  }

  return <Icon className={classNames(styles.icon, className)}
               role="img"
               aria-label={aiIndicatorLabel(kind)} />;
}

export function useAiIndicatorLabel() {
  const {t} = useI18n();

  return kind => t(kind, {scope: 'pageflow_scrolled.public.ai_indicators'});
}
