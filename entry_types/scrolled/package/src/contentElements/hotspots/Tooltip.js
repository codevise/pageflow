import React from 'react';
import classNames from 'classnames';

import {
  EditableText,
  EditableInlineText,
  useContentElementConfigurationUpdate,
  useI18n
} from 'pageflow-scrolled/frontend';

import styles from './Tooltip.module.css';

export function Tooltip({area, portraitMode, configuration}) {
  const {t} = useI18n();
  const updateConfiguration = useContentElementConfigurationUpdate();

  const indicatorPosition = (
    portraitMode ?
    area.portraitIndicatorPosition :
    area.indicatorPosition
  ) || [50, 50];
  const tooltipTexts = configuration.tooltipTexts || {};

  function handleTextChange(propertyName, value) {
    updateConfiguration({
      tooltipTexts: {
        ...tooltipTexts,
        [area.id]: {
          ...tooltipTexts[area.id],
          [propertyName]: value
        }
      }
    });
  }

  return (
    <div className={classNames(styles.tooltip, styles.visible)}
         style={{left: `${indicatorPosition[0]}%`,
                 top: `${indicatorPosition[1]}%`}}>
      <div className={styles.box}>
        <h3>
          <EditableInlineText value={tooltipTexts[area.id]?.title}
                              onChange={value => handleTextChange('title', value)}
                              placeholder={t('pageflow_scrolled.inline_editing.type_heading')} />
        </h3>
        <EditableText value={tooltipTexts[area.id]?.description}
                      onChange={value => handleTextChange('description', value)}
                      placeholder={t('pageflow_scrolled.inline_editing.type_text')} />
        <a href="#story">
          <EditableInlineText value={tooltipTexts[area.id]?.link}
                              onChange={value => handleTextChange('link', value)}
                              placeholder={t('pageflow_scrolled.inline_editing.type_text')} />
          ›
        </a>
      </div>
    </div>
  );
}
