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
  InlineFileRights,
  Image,
  Text,
  useContentElementEditorState,
  useContentElementConfigurationUpdate,
  useDarkBackground,
  useFileWithInlineRights,
  useI18n,
  utils
} from 'pageflow-scrolled/frontend';

import {getTooltipReferencePosition} from './getTooltipReferencePosition';

import styles from './Tooltip.module.css';

export function Tooltip({
  area,
  contentElementId, portraitMode, configuration, visible, active,
  panZoomEnabled, imageFile, containerRect, keepInViewport, floatingStrategy,
  onMouseEnter, onMouseLeave, onClick, onDismiss,
}) {
  const {t: translateWithEntryLocale} = useI18n();
  const {t} = useI18n({locale: 'ui'});
  const updateConfiguration = useContentElementConfigurationUpdate();
  const {isEditable} = useContentElementEditorState();

  const darkBackground = useDarkBackground();
  const light = configuration.invertTooltips ? !darkBackground : darkBackground;

  const tooltipImageFile = useFileWithInlineRights({
    configuration: area,
    collectionName: 'imageFiles',
    propertyName: 'tooltipImage'
  });

  const referencePosition = getTooltipReferencePosition({
    area,
    contentElementId, portraitMode, configuration,
    panZoomEnabled, imageFile, containerRect,
  })

  const tooltipTexts = configuration.tooltipTexts || {};
  const tooltipLinks = configuration.tooltipLinks || {};

  const referenceType = portraitMode ? area.portraitTooltipReference : area.tooltipReference;
  const position = portraitMode ? area.portraitTooltipPosition : area.tooltipPosition;
  const maxWidth = portraitMode ? area.portraitTooltipMaxWidth : area.tooltipMaxWidth;

  const arrowRef = useRef();
  const {refs, floatingStyles, context} = useFloating({
    open: containerRect.width > 0 && visible,
    onOpenChange: open => !open && onDismiss(),
    strategy: floatingStrategy || 'absolute',
    placement: position === 'above' ? 'top' : 'bottom',
    middleware: [
      offset(referenceType === 'area' ? 7 : 20),
      shift({crossAxis: keepInViewport, padding: {left: 16, right: 16}}),
      keepInViewport && flip(),
      arrow({
        element: arrowRef,
        padding: 5
      })
    ],
    whileElementsMounted: autoUpdate
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
        children: [{text: translateWithEntryLocale('pageflow_scrolled.public.more')}]
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
             style={referencePosition}
             {...getReferenceProps()} />
      </CompositeItem>
      {isMounted &&
       <TooltipPortal>
         <FloatingFocusManager context={context} modal={false} initialFocus={-1} returnFocus={false}>
           <div style={transitionStyles}>
             <div ref={refs.setFloating}
                  style={floatingStyles}
                  className={classNames(styles.box,
                                        styles[`maxWidth-${maxWidth}`],
                                        styles[`align-${area.tooltipTextAlign}`],
                                        light ? styles.light : styles.dark,
                                        {[styles.editable]: isEditable,
                                         [styles.minWidth]: presentOrEditing('link')})}
                  onMouseEnter={onMouseEnter}
                  onMouseLeave={onMouseLeave}
                  onClick={onClick}
                  {...getFloatingProps()}>
               <FloatingArrow ref={arrowRef} context={context} strokeWidth={1} />
               {tooltipImageFile &&
                <>
                  <div className={styles.imageWrapper}>
                    <Image imageFile={tooltipImageFile}
                           variant={'medium'}
                           fill={false}
                           width={tooltipImageFile.width}
                           height={tooltipImageFile.height}
                           preferSvg={true} />
                    <InlineFileRights context="insideElement" items={[{file: tooltipImageFile, label: 'image'}]} />
                    <InlineFileRights context="afterElement" items={[{file: tooltipImageFile, label: 'image'}]} />
                  </div>
                </>}
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
