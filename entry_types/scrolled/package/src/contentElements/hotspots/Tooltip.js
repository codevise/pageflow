import React, {useRef} from 'react';
import classNames from 'classnames';

import {
  useFloating, useDismiss, useInteractions, useRole,
  CompositeItem,
  FloatingArrow, FloatingFocusManager,
  arrow, shift, offset, flip,
  autoUpdate
} from '@floating-ui/react';

import {TooltipPortal} from './TooltipPortal';
import {useTooltipTransitionStyles} from './useTooltipTransitionStyles';
import {insideScrollButton} from './ScrollButton';

import {
  EditableText,
  EditableInlineText,
  EditableLink,
  Image,
  Text,
  useContentElementEditorState,
  useContentElementConfigurationUpdate,
  useFile,
  useI18n,
  utils
} from 'pageflow-scrolled/frontend';

import {getPanZoomStepTransform} from './panZoom';

import styles from './Tooltip.module.css';

export function Tooltip({
  area,
  contentElementId, portraitMode, configuration, visible, active,
  panZoomEnabled, imageFile, containerRect, flip: shouldFlip,
  onMouseEnter, onMouseLeave, onClick, onDismiss,
}) {
  const {t} = useI18n({locale: 'ui'});
  const updateConfiguration = useContentElementConfigurationUpdate();
  const {isEditable} = useContentElementEditorState();

  const tooltipImageFile = useFile({
    collectionName: 'imageFiles', permaId: area.tooltipImage
  });

  const indicatorPosition = getIndicatorPosition({
    area,
    contentElementId, portraitMode, configuration,
    panZoomEnabled, imageFile, containerRect,
  })

  const tooltipTexts = configuration.tooltipTexts || {};
  const tooltipLinks = configuration.tooltipLinks || {};

  const arrowRef = useRef();
  const {refs, floatingStyles, context} = useFloating({
    open: visible,
    onOpenChange: open => !open && onDismiss(),
    placement: area.tooltipPosition === 'above' ? 'top' : 'bottom',
    middleware: [
      offset(20),
      shift(),
      shouldFlip && flip(),
      arrow({
        element: arrowRef
      })
    ],
    whileElementsMounted(referenceEl, floatingEl, update) {
      return autoUpdate(referenceEl, floatingEl, update, {
        elementResize: false,
        layoutShift: false,
      });
    }
  });

  const role = useRole(context, {role: 'label'});

  const dismiss = useDismiss(context, {
    outsidePressEvent: 'mousedown',
    outsidePress: event => !insideScrollButton(event.target)
  });

  const {getReferenceProps, getFloatingProps} = useInteractions([
    role,
    dismiss,
  ]);
  const {isMounted, styles: transitionStyles} = useTooltipTransitionStyles(context);

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
    <>
      <CompositeItem render={<div className={styles.compositeItem} />}>
        <div ref={refs.setReference}
             className={styles.reference}
             style={{left: indicatorPosition[0],
                     top: indicatorPosition[1]}}
             {...getReferenceProps()} />
      </CompositeItem>
      {isMounted &&
       <TooltipPortal>
         <FloatingFocusManager context={context} modal={false} initialFocus={-1} returnFocus={false}>
           <div style={transitionStyles}>
             <div ref={refs.setFloating}
                  style={floatingStyles}
                  className={classNames(styles.box,
                                        {[styles.editable]: isEditable})}
                  onMouseEnter={onMouseEnter}
                  onMouseLeave={onMouseLeave}
                  onClick={onClick}
                  {...getFloatingProps()}>
               <FloatingArrow ref={arrowRef} context={context} />
               <Image imageFile={tooltipImageFile}
                      variant={'linkThumbnailLarge'}
                      fill={false}
                      width={394}
                      height={226}
                      preferSvg={true} />
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
         </FloatingFocusManager>
       </TooltipPortal>}
    </>
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
