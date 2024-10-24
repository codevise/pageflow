import React, {forwardRef, useCallback, useState, useEffect, useRef} from 'react';
import classNames from 'classnames';
import {
  useContentElementConfigurationUpdate,
  useContentElementEditorState,
  useContentElementLifecycle,
  useFileWithInlineRights,
  ContentElementBox,
  Figure,
  FitViewport,
  FullscreenViewer,
  Image,
  InlineFileRights,
  ToggleFullscreenCornerButton,
  usePhonePlatform,
  contentElementWidths
} from 'pageflow-scrolled/frontend';

import {ScrollButton} from './ScrollButton';
import {useIntersectionObserver} from './useIntersectionObserver'

import styles from './ImageGallery.module.css';

export function ImageGallery({configuration, contentElementId, contentElementWidth, customMargin}) {
  const [visibleIndex, setVisibleIndex] = useState(-1);
  const isPhonePlatform = usePhonePlatform();

  return (
    <FullscreenViewer
      contentElementId={contentElementId}
      renderChildren={({enterFullscreen, isFullscreen}) =>
        <Scroller customMargin={customMargin}
                  configuration={configuration}
                  contentElementWidth={contentElementWidth}
                  controlled={isFullscreen}
                  displayFullscreenToggle={!isPhonePlatform &&
                                           contentElementWidth !== contentElementWidths.full &&
                                           configuration.enableFullscreenOnDesktop}
                  visibleIndex={visibleIndex}
                  setVisibleIndex={setVisibleIndex}
                  onFullscreenEnter={enterFullscreen} />
      }
      renderFullscreenChildren={({exitFullscreen}) => {
        return (
          <Scroller configuration={configuration}
                    contentElementWidth={contentElementWidth}
                    visibleIndex={visibleIndex}
                    setVisibleIndex={setVisibleIndex}
                    displayFullscreenToggle={false}
                    onBump={exitFullscreen}
                    onFullscreenExit={exitFullscreen} />
        );
      }} />
  );
}

function Scroller({
  visibleIndex, setVisibleIndex,
  displayFullscreenToggle,
  customMargin,
  onFullscreenEnter, onFullscreenExit,
  onBump,
  configuration,
  contentElementWidth,
  controlled
}) {
  const lastVisibleIndex = useRef(null);
  const {isSelected, isEditable} = useContentElementEditorState();

  let items = configuration.items || [];

  if (!items.length && isEditable) {
    items = [{id: 1, placeholder: true}];
  }

  const onVisibleIndexChange = useCallback(index => {
    if (!controlled) {
      lastVisibleIndex.current = index;
      setVisibleIndex(index);
    }
  }, [controlled, setVisibleIndex]);

  const {containerRef: scrollerRef, setChildRef} = useIntersectionObserver({
    onVisibleIndexChange,
    threshold: 0.7
  });

  useEffect(() => {
    if (lastVisibleIndex.current !== visibleIndex &&
        visibleIndex >= 0 &&
        (controlled || lastVisibleIndex.current === null)) {

      lastVisibleIndex.current = visibleIndex;

      const scroller = scrollerRef.current;
      const item = scroller.children[visibleIndex];

      scroller.style.scrollBehavior = 'auto';
      scroller.scrollTo(Math.abs(scroller.offsetLeft - item.offsetLeft), 0);
      scroller.style.scrollBehavior = null;
    }
  }, [visibleIndex, scrollerRef, controlled]);

  function scrollBy(delta) {
    const scroller = scrollerRef.current;
    const child = scroller.children[visibleIndex + delta];

    if (child) {
      scrollerRef.current.scrollTo(child.offsetLeft - scroller.offsetLeft, 0);
    }
  }

  function handleClick(event) {
    if (isEditable && !isSelected) {
      return;
    }

    const rect = scrollerRef.current.getBoundingClientRect();

    if ((event.pageX - rect.x) / rect.width < 0.5) {
      if (visibleIndex > 0) {
        scrollBy(-1);
      }
      else if (onBump) {
        onBump();
      }
    }
    else {
      if (visibleIndex < items.length - 1) {
        scrollBy(1);
      }
      else if (onBump) {
        onBump();
      }
    }
  }

  return (
    <div className={classNames(styles.wrapper,
                               {[styles.wide]:
                                 contentElementWidth === contentElementWidths.lg ||
                                 contentElementWidth === contentElementWidths.xl},
                               {[styles.customMargin]: customMargin})}>
      <div className={styles.leftButton}>
        <ScrollButton direction="left"
                      disabled={visibleIndex <= 0}
                      onClick={() => scrollBy(-1)} />
      </div>
      <div className={styles.rightButton}>
        <ScrollButton direction="right"
                      disabled={visibleIndex >= items.length - 1}
                      onClick={() => scrollBy(1)}/>
      </div>
      <div className={styles.items}
           ref={scrollerRef}>
        {items.map((item, index) => (
          <Item key={item.id}
                ref={setChildRef(index)}
                item={item}
                current={index === visibleIndex}
                captions={configuration.captions || {}}
                captionVariant={configuration.captionVariant}
                onClick={handleClick}>
            {displayFullscreenToggle &&
             <ToggleFullscreenCornerButton isFullscreen={false}
                                           onEnter={onFullscreenEnter} />}
          </Item>
        ))}
      </div>
    </div>
  );
}

const Item = forwardRef(function({item, captions, captionVariant, current, onClick, children}, ref) {
  const updateConfiguration = useContentElementConfigurationUpdate();
  const {shouldLoad} = useContentElementLifecycle();

  const caption = captions[item.id];

  const imageFile = useFileWithInlineRights({
    configuration: item,
    collectionName: 'imageFiles',
    propertyName: 'image'
  });

  const handleCaptionChange = function(caption) {
    updateConfiguration({
      captions: {
        ...captions,
        [item.id]: caption
      }
    });
  }

  return (
    <div className={classNames(styles.item, {[styles.current]: current,
                                             [styles.placeholder]: item.placeholder})}
         ref={ref}>
      <div className={styles.figure}>
        <FitViewport file={imageFile}
                     aspectRatio={imageFile ? undefined : 0.75}
                     scale={0.8}
                     opaque={!imageFile}>
          <ContentElementBox>
            <Figure caption={caption}
                    variant={captionVariant}
                    onCaptionChange={handleCaptionChange}
                    addCaptionButtonVisible={current && !item.placeholder}
                    addCaptionButtonPosition="inside">
              <FitViewport.Content>
                <div onClick={onClick}>
                  <Image imageFile={imageFile} load={shouldLoad} />
                </div>
                {children}
                <InlineFileRights context="insideElement" items={[{file: imageFile, label: 'image'}]} />
              </FitViewport.Content>
            </Figure>
          </ContentElementBox>
          <InlineFileRights context="afterElement" items={[{file: imageFile, label: 'image'}]} />
        </FitViewport>
      </div>
    </div>
  );
});
