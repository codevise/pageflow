import React, {useCallback, useEffect, useMemo, useState} from 'react';

import {
  ContentElementBox,
  Image,
  ContentElementFigure,
  FitViewport,
  FullscreenViewer,
  ToggleFullscreenCornerButton,
  useContentElementEditorState,
  useContentElementEditorCommandSubscription,
  useContentElementLifecycle,
  useFileWithInlineRights,
  usePortraitOrientation,
  InlineFileRights,
  contentElementWidths
} from 'pageflow-scrolled/frontend';

import {Scroller} from './Scroller';
import {Area} from './Area';
import {Tooltip, insideTooltip} from './Tooltip';

import {useContentRect} from './useContentRect';
import {useScrollPanZoom} from './useScrollPanZoom';

import styles from './Hotspots.module.css';

export function Hotspots({contentElementId, contentElementWidth, configuration}) {
  return (
    <FullscreenViewer
      contentElementId={contentElementId}
      renderChildren={({enterFullscreen}) =>
        <HotspotsImage
          contentElementId={contentElementId}
          contentElementWidth={contentElementWidth}
          configuration={configuration}
          displayFullscreenToggle={contentElementWidth !== contentElementWidths.full &&
                                   configuration.enableFullscreen}
          onFullscreenEnter={enterFullscreen} />
      }
      renderFullscreenChildren={() =>
        <HotspotsImage
          contentElementId={contentElementId}
          contentElementWidth={contentElementWidth}
          configuration={configuration}
          displayFullscreenToggle={false} />
      } />
  );
}

export function HotspotsImage({
  contentElementId, contentElementWidth, configuration,
  displayFullscreenToggle, onFullscreenEnter
}) {
  const defaultImageFile = useFileWithInlineRights({
    configuration, collectionName: 'imageFiles', propertyName: 'image'
  });
  const portraitImageFile = useFileWithInlineRights({
    configuration, collectionName: 'imageFiles', propertyName: 'portraitImage'
  });
  const portraitOrientation = usePortraitOrientation();

  const {shouldLoad} = useContentElementLifecycle();
  const {setTransientState} = useContentElementEditorState();

  const [activeIndex, setActiveIndexState] = useState(
    'initialActiveArea' in configuration ? configuration.initialActiveArea : -1
  );
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const portraitMode = portraitOrientation && portraitImageFile
  const imageFile = portraitMode ? portraitImageFile : defaultImageFile;

  const panZoomEnabled = configuration.enablePanZoom === 'always';

  const areas = useMemo(() => configuration.areas || [], [configuration.areas]);

  const hasActiveArea = activeIndex >= 0;
  const setActiveIndex = useCallback(index => {
    setActiveIndexState(index);
    setTransientState({activeAreaId: areas[index]?.id});
  }, [setActiveIndexState, setTransientState, areas]);


  const [containerRect, contentRectRef] = useContentRect({
    enabled: panZoomEnabled && shouldLoad
  });

  const [wrapperRef, scrollerRef, setScrollerStepRef, scrollFromToArea] = useScrollPanZoom({
    containerRect,
    imageFile,
    areas,
    enabled: panZoomEnabled && shouldLoad,
    onChange: setActiveIndex
  });

  const scrollToArea = useCallback((index) => {
    scrollFromToArea(activeIndex, index);
  }, [scrollFromToArea, activeIndex]);

  const activateArea = panZoomEnabled ? scrollToArea : setActiveIndex;

  useEffect(() => {
    if (hasActiveArea) {
      document.body.addEventListener('click', handleClick);
      return () => document.body.removeEventListener('click', handleClick);
    }

    function handleClick(event) {
      if (!insideTooltip(event.target)) {
        activateArea(-1);
      }
    }
  }, [hasActiveArea, activateArea]);

  useContentElementEditorCommandSubscription(command => {
    if (command.type === 'HIGHLIGHT_AREA') {
      setHighlightedIndex(command.index);
    }
    else if (command.type === 'RESET_AREA_HIGHLIGHT') {
      setHighlightedIndex(-1);
    }
    else if (command.type === 'SET_ACTIVE_AREA') {
      activateArea(command.index);
    }
  });

  return (
    <div className={styles.center}>
      <FitViewport file={imageFile}
                   aspectRatio={imageFile ? undefined : 0.75}
                   fill={configuration.position === 'backdrop'}
                   opaque={!imageFile}>
        <div className={styles.outer}>
          <ContentElementBox>
            <ContentElementFigure configuration={configuration}>
              <FitViewport.Content>
                <div className={styles.stack}
                     ref={contentRectRef}>
                  <div className={styles.wrapper}
                       ref={wrapperRef}>
                    <Image imageFile={imageFile}
                           load={shouldLoad}
                           fill={false}
                           structuredData={true}
                           variant="large"
                           preferSvg={true} />
                    {areas.map((area, index) =>
                      <Area key={index}
                            area={area}
                            contentElementId={contentElementId}
                            portraitMode={portraitMode}
                            activeImageVisible={activeIndex === index ||
                                                (activeIndex < 0 && hoveredIndex === index)}
                            highlighted={hoveredIndex === index || highlightedIndex === index || activeIndex === index}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(-1)}
                            onClick={() => activateArea(index)} />
                    )}
                  </div>
                  {panZoomEnabled && <Scroller areas={areas}
                                               ref={scrollerRef}
                                               setStepRef={setScrollerStepRef}
                                               noPointerEvents={activeIndex < 0} />}
                </div>
                {displayFullscreenToggle &&
                 <ToggleFullscreenCornerButton isFullscreen={false}
                                               onEnter={onFullscreenEnter} />}
                <InlineFileRights context="insideElement" items={[{file: imageFile, label: 'image'}]} />
              </FitViewport.Content>
            </ContentElementFigure>
          </ContentElementBox>
          {areas.map((area, index) =>
            <Tooltip key={index}
                     area={area}
                     contentElementId={contentElementId}
                     containerRect={containerRect}
                     imageFile={imageFile}
                     panZoomEnabled={panZoomEnabled}
                     portraitMode={portraitMode}
                     configuration={configuration}
                     visible={activeIndex === index ||
                              (!panZoomEnabled && activeIndex < 0 && hoveredIndex === index)}
                     active={activeIndex === index}
                     onMouseEnter={() => setHoveredIndex(index)}
                     onMouseLeave={() => setHoveredIndex(-1)}
                     onClick={() => setActiveIndex(index)} />
          )}
        </div>
        <InlineFileRights context="afterElement" items={[{file: imageFile, label: 'image'}]} />
      </FitViewport>
    </div>
  );
}
