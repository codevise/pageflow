import React, {useLayoutEffect, useRef, useState} from 'react';
import classNames from 'classnames';

import {
  EditableText,
  EditableInlineText,
  useContentElementConfigurationUpdate,
  useI18n
} from 'pageflow-scrolled/frontend';

import styles from './Tooltip.module.css';

export function Tooltip({
  area,
  contentElementId, portraitMode, configuration, visible,
  onMouseEnter, onMouseLeave, onClick
}) {
  const {t} = useI18n();
  const updateConfiguration = useContentElementConfigurationUpdate();

  const indicatorPosition = (
    portraitMode ?
    area.portraitIndicatorPosition :
    area.indicatorPosition
  ) || [50, 50];
  const tooltipTexts = configuration.tooltipTexts || {};

  const [ref, delta] = useKeepInViewport(visible);

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
    <div ref={ref}
         className={classNames(styles.tooltip,
                               styles[`position-${area.tooltipPosition || 'below'}`],
                               {[styles.visible]: visible})}
         style={{left: `${indicatorPosition[0]}%`,
                 top: `${indicatorPosition[1]}%`,
                 '--delta': `${delta}px`}}
         onMouseEnter={onMouseEnter}
         onMouseLeave={onMouseLeave}
         onClick={onClick}>
      <div className={styles.box}>
        <h3 id={`hotspots-tooltip-title-${contentElementId}-${area.id}`}>
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

export function insideTooltip(element) {
  return !!element.closest(`.${styles.tooltip}`);
}

function useKeepInViewport(visible) {
  const ref = useRef();
  const [delta, setDelta] = useState(0);

  useLayoutEffect(() => {
    if (!visible) {
      return;
    }

    const current = ref.current;

    const intersectionObserver = new IntersectionObserver(
      entries => {
        if (entries[entries.length - 1].intersectionRatio < 1) {
          const rect = current.getBoundingClientRect();

          if (rect.left < 0) {
            setDelta(-rect.left);
          }
          else if (rect.right > document.body.clientWidth) {
            setDelta(document.body.clientWidth - rect.right);
          }
        }
        else {
          setDelta(0);
        }
      },
      {
        threshold: 1
      }
    );

    intersectionObserver.observe(current);

    return () => intersectionObserver.unobserve(current);
  }, [visible]);

  return [ref, delta];
}
