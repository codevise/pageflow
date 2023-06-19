import React, {forwardRef, useState, useEffect, useRef} from 'react';
import classNames from 'classnames';
import {
  useContentElementConfigurationUpdate,
  useContentElementEditorState,
  useContentElementLifecycle,
  useFile,
  Figure,
  FitViewport,
  FullscreenViewer,
  Image,
  ToggleFullscreenCornerButton
} from 'pageflow-scrolled/frontend';

import {ScrollButton} from './ScrollButton';
import {useIntersectionObserver} from './useIntersectionObserver'

import styles from './ImageGallery.module.css';

export function ImageGallery({configuration, contentElementId}) {
  const [visibleIndex, setVisibleIndex] = useState(0);

  return (
    <FullscreenViewer
      contentElementId={contentElementId}
      renderChildren={({enterFullscreen, isFullscreen}) =>
        <Scroller configuration={configuration}
                  controlled={isFullscreen}
                  isFullscreen={false}
                  visibleIndex={visibleIndex}
                  setVisibleIndex={setVisibleIndex}
                  onFullscreenEnter={enterFullscreen} />
      }
    renderFullscreenChildren={({exitFullscreen}) => {
        return (
          <Scroller configuration={configuration}
                    visibleIndex={visibleIndex}
                    setVisibleIndex={setVisibleIndex}
                    isFullscreen={true}
                    onBump={exitFullscreen}
                    onFullscreenExit={exitFullscreen} />
        );
      }} />
  );
}

function Scroller({
  visibleIndex, setVisibleIndex,
  isFullscreen,
  onFullscreenEnter, onFullscreenExit,
  onBump,
  configuration,
  controlled
}) {
  const lastVisibleIndex = useRef();
  const items = configuration.items || [];
  const {isSelected, isEditable} = useContentElementEditorState();

  const {containerRef: scrollerRef, setChildRef} = useIntersectionObserver({
    setVisibleIndex(index) {
      if (!controlled) {
        lastVisibleIndex.current = index;
        setVisibleIndex(index);
      }
    },
    threshold: 0.5
  });

  useEffect(() => {
    if (lastVisibleIndex.current !== visibleIndex && visibleIndex >= 0) {
      lastVisibleIndex.current = visibleIndex;

      const scroller = scrollerRef.current;
      const item = scroller.children[visibleIndex];

      scroller.scrollTo(Math.abs(scroller.offsetLeft - item.offsetLeft), 0);
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
    <div className={styles.wrapper}>
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
                onClick={handleClick}>
            {!isFullscreen &&
             <ToggleFullscreenCornerButton isFullscreen={false}
                                           onEnter={onFullscreenEnter} />}
          </Item>
        ))}
      </div>
    </div>
  );
}

const Item = forwardRef(function({item, captions, current, onClick, children}, ref) {
  const updateConfiguration = useContentElementConfigurationUpdate();
  const {shouldLoad} = useContentElementLifecycle();

  const caption = captions[item.id];

  const imageFile = useFile({
    collectionName: 'imageFiles',
    permaId: item.image
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
    <div className={classNames(styles.item, {[styles.current]: current})} ref={ref}>
      <div className={styles.figure}>
        <FitViewport file={imageFile}
                     aspectRatio={imageFile ? undefined : 0.75}
                     opaque={!imageFile}>
          <Figure caption={caption}
                  onCaptionChange={handleCaptionChange}
                  addCaptionButtonVisible={current}
                  addCaptionButtonPosition="inside">
            <FitViewport.Content>
              <div onClick={onClick}>
                <Image imageFile={imageFile} load={shouldLoad} />
              </div>
              {children}
            </FitViewport.Content>
          </Figure>
        </FitViewport>
      </div>
    </div>
  );
});
