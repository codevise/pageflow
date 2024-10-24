import React, {useCallback, useMemo, useState} from 'react';
import classNames from 'classnames';
import {Composite, CompositeItem} from '@floating-ui/react';

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
  usePhonePlatform,
  InlineFileRights,
  contentElementWidths
} from 'pageflow-scrolled/frontend';

import {ScrollButton} from './ScrollButton';
import {Scroller} from './Scroller';
import {Area} from './Area';
import {ImageArea} from './ImageArea';
import {Indicator} from './Indicator';
import {Tooltip} from './Tooltip';

import {useContentRect} from './useContentRect';
import {useScrollPanZoom} from './useScrollPanZoom';

import styles from './Hotspots.module.css';

export function Hotspots({contentElementId, contentElementWidth, customMargin, configuration}) {
  return (
    <FullscreenViewer
      contentElementId={contentElementId}
      renderChildren={({enterFullscreen}) =>
        <HotspotsImage
          contentElementId={contentElementId}
          contentElementWidth={contentElementWidth}
          customMargin={customMargin}
          configuration={configuration}
          displayFullscreenToggle={contentElementWidth !== contentElementWidths.full &&
                                   configuration.enableFullscreen}
          onFullscreenEnter={enterFullscreen}
          floatingStrategy={configuration.position === 'standAlone' ? 'fixed' : 'absolute'}>
          {children =>
            <ContentElementBox>
              <ContentElementFigure configuration={configuration}>
                <div className={styles.clip}>
                  {children}
                </div>
              </ContentElementFigure>
            </ContentElementBox>
          }
        </HotspotsImage>
      }
      renderFullscreenChildren={() =>
        <HotspotsImage
          contentElementId={contentElementId}
          contentElementWidth={contentElementWidth}
          configuration={configuration}
          displayFullscreenToggle={false}
          keepTooltipsInViewport={true}
          tooltipsAboveNavigationWidgets={true} />
      } />
  );
}

export function HotspotsImage({
  contentElementId, contentElementWidth, customMargin, configuration,
  keepTooltipsInViewport, floatingStrategy, tooltipsAboveNavigationWidgets,
  displayFullscreenToggle, onFullscreenEnter,
  children = children => children
}) {
  const defaultImageFile = useFileWithInlineRights({
    configuration, collectionName: 'imageFiles', propertyName: 'image'
  });
  const portraitImageFile = useFileWithInlineRights({
    configuration, collectionName: 'imageFiles', propertyName: 'portraitImage'
  });
  const portraitOrientation = usePortraitOrientation();
  const isPhonePlatform = usePhonePlatform();

  const {shouldLoad} = useContentElementLifecycle();
  const {setTransientState, select, isEditable, isSelected} = useContentElementEditorState();

  const [activeIndex, setActiveIndexState] = useState(
    'initialActiveArea' in configuration ? configuration.initialActiveArea : -1
  );
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const portraitMode = !!(portraitOrientation && portraitImageFile);
  const imageFile = portraitMode ? portraitImageFile : defaultImageFile;

  const panZoomEnabled = configuration.enablePanZoom === 'always' ||
                         (configuration.enablePanZoom === 'phonePlatform' && isPhonePlatform);

  const areas = useMemo(() => configuration.areas || [], [configuration.areas]);

  const setActiveIndex = useCallback(index => {
    setTransientState({activeAreaId: areas[index]?.id});

    setActiveIndexState(activeIndex => {
      if (activeIndex !== index && index >= 0 && isSelected) {
        select();
      }
      return index;
    });
  }, [setActiveIndexState, setTransientState, areas, select, isSelected]);

  const [containerRect, contentRectRef] = useContentRect({
    enabled: shouldLoad
  });

  const [wrapperRef, scrollerRef, scrollerAreasRef, setScrollerStepRef, setIndicatorRef, scrollFromToArea] = useScrollPanZoom({
    containerRect,
    imageFile,
    areas,
    enabled: panZoomEnabled && shouldLoad,
    portraitMode,
    onChange: setActiveIndex
  });

  const scrollToArea = useCallback((index) => {
    scrollFromToArea(activeIndex, index);
  }, [scrollFromToArea, activeIndex]);

  const activateArea = panZoomEnabled ? scrollToArea : setActiveIndex;

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

  function renderScrollButtons() {
    if (!panZoomEnabled) {
      return null;
    }

    return (
      <>
        <div className={styles.left}>
          <ScrollButton direction="left"
                        disabled={activeIndex === -1}
                        onClick={() => {
                          if (activeIndex >= 0) {
                            activateArea(activeIndex - 1)
                          }
                        }} />
        </div>
        <div className={styles.right}>
          <ScrollButton direction="right"
                        disabled={activeIndex >= areas.length}
                        onClick={() => {
                          if (activeIndex < areas.length) {
                            activateArea(activeIndex + 1)
                          }
                        }}/>
        </div>
      </>
    );
  }

  function renderVisibleAreas() {
    return areas.map((area, index) =>
      <ImageArea key={index}
                 area={area}
                 panZoomEnabled={panZoomEnabled}
                 portraitMode={portraitMode}
                 activeImageVisible={activeIndex === index ||
                                     (!panZoomEnabled &&
                                      activeIndex < 0 &&
                                      hoveredIndex === index)}
                 outlined={isEditable && isSelected}
                 highlighted={hoveredIndex === index ||
                              highlightedIndex === index ||
                              activeIndex === index} />
    );
  }

  function renderClickableAreas() {
    return areas.map((area, index) =>
      <Area key={index}
            area={area}
            portraitMode={portraitMode}
            noPointerEvents={panZoomEnabled &&
                             activeIndex >= 0 &&
                             activeIndex < areas.length}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(-1)}
            onClick={() => {
              if (!isEditable || isSelected) {
                activateArea(index)
              }
            }} />
    );
  }

  function renderIndicators() {
    return areas.map((area, index) =>
      <Indicator key={index}
                 area={area}
                 hidden={panZoomEnabled &&
                         activeIndex >= 0 &&
                         activeIndex < areas.length &&
                         activeIndex !== index}
                 outerRef={setIndicatorRef(index)}
                 portraitMode={portraitMode} />
    );
  }

  function renderTooltips() {
    return areas.map((area, index) =>
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
               keepInViewport={keepTooltipsInViewport}
               aboveNavigationWidgets={tooltipsAboveNavigationWidgets}
               wrapperRef={contentRectRef}
               floatingStrategy={floatingStrategy}
               onMouseEnter={() => setHoveredIndex(index)}
               onMouseLeave={() => setHoveredIndex(-1)}
               onClick={() => setActiveIndex(index)}
               onDismiss={() => activateArea(-1)} />
    );
  }

  function renderFullscreenToggle() {
    if (!displayFullscreenToggle) {
      return null;
    }

    return (
      <ToggleFullscreenCornerButton isFullscreen={false}
                                    onEnter={onFullscreenEnter} />
    );
  }

  return (
    <div className={classNames(styles.outer, {[styles.customMargin]: customMargin})}>
      {renderScrollButtons()}
      <div className={styles.center}>
        <FitViewport file={imageFile}
                     aspectRatio={imageFile ? undefined : 0.75}
                     fill={configuration.position === 'backdrop'}
                     opaque={!imageFile}>
          <Composite activeIndex={activeIndex + 1}
                     loop={false}
                     onNavigate={index => activateArea(index - 1)}>
            <div className={styles.tooltipsWrapper}>
              {children(
                <FitViewport.Content>
                  <div className={styles.stack}
                       ref={contentRectRef}>
                    <div className={styles.wrapper}
                         ref={wrapperRef}>
                      <Image imageFile={imageFile}
                             load={shouldLoad}
                             fill={false}
                             structuredData={true}
                             variant={panZoomEnabled ? 'ultra' : 'large'}
                             preferSvg={true} />
                      {renderVisibleAreas()}
                    </div>
                    <Scroller disabled={!panZoomEnabled}
                              areas={areas}
                              ref={scrollerRef}
                              setStepRef={setScrollerStepRef}
                              containerRect={containerRect}>
                      <div className={styles.wrapper}
                           ref={scrollerAreasRef}>
                        {renderClickableAreas()}
                      </div>
                    </Scroller>
                    {renderIndicators()}
                  </div>
                  {renderFullscreenToggle()}
                  <InlineFileRights configuration={configuration}
                                    context="insideElement"
                                    items={[{file: imageFile, label: 'image'}]} />
                </FitViewport.Content>
              )}
              <CompositeItem render={<div className={styles.compositeItem} />} />
              {renderTooltips()}
              <CompositeItem render={<div className={styles.compositeItem} />} />
            </div>
          </Composite>
          <InlineFileRights configuration={configuration}
                            context="afterElement"
                            items={[{file: imageFile, label: 'image'}]} />
        </FitViewport>
      </div>
    </div>
  );
}
