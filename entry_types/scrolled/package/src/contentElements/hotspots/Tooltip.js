import React, {useLayoutEffect, useRef, useState} from 'react';
import classNames from 'classnames';

import {
  EditableText,
  EditableInlineText,
  EditableLink,
  Text,
  useContentElementEditorState,
  useContentElementConfigurationUpdate,
  useI18n,
  utils
} from 'pageflow-scrolled/frontend';

import {getPanZoomStepTransform} from './panZoom';

import styles from './Tooltip.module.css';

export function Tooltip({
  area,
  contentElementId, portraitMode, configuration, visible, active,
  panZoomEnabled, imageFile, containerRect,
  onMouseEnter, onMouseLeave, onClick
}) {
  const {t} = useI18n({locale: 'ui'});
  const updateConfiguration = useContentElementConfigurationUpdate();
  const {isEditable} = useContentElementEditorState();

  const indicatorPosition = getIndicatorPosition({
    area,
    contentElementId, portraitMode, configuration,
    panZoomEnabled, imageFile, containerRect,
  })

  const tooltipTexts = configuration.tooltipTexts || {};
  const tooltipLinks = configuration.tooltipLinks || {};

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

  function handleLinkChange(value) {
    if (utils.isBlankEditableTextValue(tooltipTexts[area.id]?.link)) {
      handleTextChange('link', [{
        type: 'heading',
        children: [{text: t('pageflow_scrolled.public.more')}]
      }]);
    }

    updateConfiguration({
      tooltipLinks: {
        ...tooltipLinks,
        [area.id]: value
      }
    });
  }

  function presentOrEditing(propertyName) {
    return !utils.isBlankEditableTextValue(tooltipTexts[area.id]?.[propertyName]) ||
           (isEditable && active) ||
           (isEditable &&
            utils.isBlankEditableTextValue(tooltipTexts[area.id]?.title) &&
            utils.isBlankEditableTextValue(tooltipTexts[area.id]?.description) &&
            utils.isBlankEditableTextValue(tooltipTexts[area.id]?.link));
  }

  return (
    <div ref={ref}
         className={classNames(styles.tooltip,
                               styles[`position-${area.tooltipPosition || 'below'}`],
                               {[styles.visible]: visible,
                                [styles.editable]: isEditable})}
         style={{left: indicatorPosition[0],
                 top: indicatorPosition[1],
                 '--delta': `${delta}px`}}
         onMouseEnter={onMouseEnter}
         onMouseLeave={onMouseLeave}
         onClick={onClick}>
      <div className={styles.box}>
        {presentOrEditing('title') &&
         <h3 id={`hotspots-tooltip-title-${contentElementId}-${area.id}`}>
           <Text inline scaleCategory="hotspotsTooltipTitle">
             <EditableInlineText value={tooltipTexts[area.id]?.title}
                                 onChange={value => handleTextChange('title', value)}
                                 placeholder={t('pageflow_scrolled.inline_editing.type_heading')} />
           </Text>
         </h3>}
        {presentOrEditing('description') &&
         <EditableText value={tooltipTexts[area.id]?.description}
                       onChange={value => handleTextChange('description', value)}
                       scaleCategory="hotspotsTooltipDescription"
                       placeholder={t('pageflow_scrolled.inline_editing.type_text')} />}
        {presentOrEditing('link') &&
         <Text inline scaleCategory="hotspotsTooltipLink">
           <EditableLink href={tooltipLinks[area.id]?.href}
                         openInNewTab={tooltipLinks[area.id]?.openInNewTab}
                         linkPreviewDisabled={utils.isBlankEditableTextValue(tooltipTexts[area.id]?.link)}
                         className={styles.link}
                         onChange={value => handleLinkChange(value)}>
             <EditableInlineText value={tooltipTexts[area.id]?.link}
                                 onChange={value => handleTextChange('link', value)}
                                 placeholder={t('pageflow_scrolled.inline_editing.type_text')} />
             ›
           </EditableLink>
         </Text>}
      </div>
    </div>
  );
}

function getIndicatorPosition({
  area,
  portraitMode,
  panZoomEnabled, imageFile, containerRect
}) {
  const indicatorPositionInPercent = (
    portraitMode ?
    area.portraitIndicatorPosition :
    area.indicatorPosition
  ) || [50, 50];

  if (panZoomEnabled) {
    const transform = getPanZoomStepTransform({
      areaOutline: portraitMode ? area.portraitOutline : area.outline,
      areaZoom: (portraitMode ? area.portraitZoom : area.zoom) || 0,
      imageFileWidth: imageFile?.width,
      imageFileHeight: imageFile?.height,
      containerWidth: containerRect.width,
      containerHeight: containerRect.height
    });

    const indicatorPositionInPixels = [
      containerRect.width * transform.scale * indicatorPositionInPercent[0] / 100 + transform.x,
      containerRect.height * transform.scale * indicatorPositionInPercent[1] / 100 + transform.y
    ];

    return indicatorPositionInPixels.map(coord => `${coord}px`);
  }
  else {
    return indicatorPositionInPercent.map(coord => `${coord}%`);
  }
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
