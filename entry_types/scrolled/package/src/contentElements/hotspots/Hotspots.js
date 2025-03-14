import React, {useCallback} from 'react';
import {Composite, CompositeItem} from '@floating-ui/react';

import {
  ContentElementBox,
  Image,
  ContentElementFigure,
  FitViewport,
  FullscreenViewer,
  ToggleFullscreenCornerButton,
  useContentElementEditorState,
  useContentElementLifecycle,
  InlineFileRights,
  contentElementWidths
} from 'pageflow-scrolled/frontend';

import {Pager} from './Pager';
import {Scroller} from './Scroller';
import {Area} from './Area';
import {ImageArea} from './ImageArea';
import {Indicator} from './Indicator';
import {Tooltip} from './Tooltip';

import {useHotspotsConfiguration} from './useHotspotsConfiguration';
import {useHotspotsEditorCommandSubscriptions} from './useHotspotsEditorCommandSubscriptions';
import {useHotspotsState} from './useHotspotsState';
import {useContentRect} from './useContentRect';
import {usePanZoomTransforms} from './usePanZoomTransforms';
import {useScrollPanZoom} from './useScrollPanZoom';

import styles from './Hotspots.module.css';

export function Hotspots({
  contentElementId, contentElementWidth, customMargin, configuration, sectionProps = {}
}) {
  return (
    <FullscreenViewer
      contentElementId={contentElementId}
      renderChildren={({enterFullscreen}) =>
        <HotspotsImage
          contentElementId={contentElementId}
          contentElementWidth={contentElementWidth}
          customMargin={customMargin}
          configuration={configuration}
          isIntersecting={sectionProps.isIntersecting}
          displayFullscreenToggle={contentElementWidth !== contentElementWidths.full &&
                                   configuration.enableFullscreen}
          keepTooltipsInViewport={configuration.position === 'backdrop'}
          onFullscreenEnter={enterFullscreen}
          floatingStrategy={(configuration.position === 'standAlone' ||
                             configuration.position === 'backdrop') ? 'fixed' : 'absolute'}>
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
  isIntersecting,
  displayFullscreenToggle, onFullscreenEnter,
  children = children => children
}) {
  const {
    imageFile,
    areas,
    panZoomEnabled
  } = useHotspotsConfiguration(configuration);

  const {
    activeIndex,
    hoveredIndex,
    highlightedIndex,
    setActiveIndex,
    setHoveredIndex,
    setHighlightedIndex
  } = useHotspotsState({areas, initialActiveArea: configuration.initialActiveArea});

  const {shouldLoad} = useContentElementLifecycle();
  const {isEditable, isSelected} = useContentElementEditorState();

  const aspectRatio = imageFile ? `${imageFile.width} / ${imageFile.height}` : '3 / 4';

  const [containerRect, containerRef] = useContentRect({
    enabled: shouldLoad
  });

  const panZoomTransforms = usePanZoomTransforms({
    containerRect,
    imageFile,
    areas,
    initialTransformEnabled: configuration.position === 'backdrop',
    panZoomEnabled
  });

  const {panZoomRefs, scrollFromToArea} = useScrollPanZoom({
    panZoomTransforms,
    enabled: shouldLoad,
    onChange: setActiveIndex
  });

  const scrollToArea = useCallback((index) => {
    scrollFromToArea(activeIndex, index);
  }, [scrollFromToArea, activeIndex]);

  const activateArea = panZoomEnabled ? scrollToArea : setActiveIndex;

  useHotspotsEditorCommandSubscriptions({setHighlightedIndex, activateArea});

  function renderVisibleAreas() {
    return areas.map((area, index) =>
      <ImageArea key={index}
                 area={area}
                 panZoomEnabled={panZoomEnabled}
                 activeImageVisible={activeIndex === index ||
                                     (!panZoomEnabled &&
                                      activeIndex < 0 &&
                                      hoveredIndex === index)}
                 outlined={isEditable && isSelected}
                 outlineHidden={isIntersecting}
                 highlighted={hoveredIndex === index ||
                              highlightedIndex === index ||
                              activeIndex === index} />
    );
  }

  function renderClickableAreas() {
    return areas.map((area, index) =>
      <Area key={index}
            area={area}
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
                 hidden={isIntersecting ||
                         (panZoomEnabled &&
                          activeIndex >= 0 &&
                          activeIndex < areas.length &&
                          activeIndex !== index)}
                 panZoomTransform={panZoomTransforms.initial.indicators[index]}
                 outerRef={panZoomRefs.setIndicator(index)} />
    );
  }

  function renderTooltips() {
    return areas.map((area, index) =>
      <Tooltip key={index}
               area={area}
               contentElementId={contentElementId}
               containerRect={containerRect}
               imageFile={imageFile}
               panZoomTransform={panZoomTransforms.initial.tooltips[index]}
               configuration={configuration}
               visible={!isIntersecting &&
                        (activeIndex === index ||
                         (!panZoomEnabled && activeIndex < 0 && hoveredIndex === index))}
               active={activeIndex === index}
               keepInViewport={keepTooltipsInViewport}
               aboveNavigationWidgets={tooltipsAboveNavigationWidgets}
               wrapperRef={containerRef}
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

  function renderLetterboxBackground() {
    if (configuration.position !== 'backdrop') {
      return null;
    }

    return (
      <div className={styles.letterboxBackground}>
        <Image imageFile={imageFile}
               load={shouldLoad}
               variant={'medium'} />
      </div>
    );
  }

  return (
    <Pager areas={areas}
           customMargin={customMargin}
           panZoomEnabled={panZoomEnabled}
           hideButtons={isIntersecting}
           activeIndex={activeIndex}
           activateArea={activateArea}>
      <FitViewport file={imageFile}
                   aspectRatio={imageFile ? undefined : 0.75}
                   fill={configuration.position === 'backdrop'}
                   opaque={!imageFile}>
        <Composite activeIndex={activeIndex + 1}
                   loop={false}
                   onNavigate={index => activateArea(index - 1)}>
          <div className={styles.tooltipsWrapper}
               style={{'--hotspots-image-aspect-ratio': aspectRatio,
                       '--hotspots-container-height': `${containerRect.height}px`}}>
            {children(
              <FitViewport.Content>
                <div className={styles.stack}
                     ref={containerRef}>
                  {renderLetterboxBackground()}
                  <div className={styles.wrapper}
                       ref={panZoomRefs.wrapper}
                       style={{transform: panZoomTransforms.initial.wrapper}}>
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
                            ref={panZoomRefs.scroller}
                            setStepRef={panZoomRefs.setStep}>
                    <div className={styles.wrapper}
                         ref={panZoomRefs.scrollerAreas}
                         style={{transform: panZoomTransforms.initial.wrapper}}>
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
    </Pager>
  );
}
