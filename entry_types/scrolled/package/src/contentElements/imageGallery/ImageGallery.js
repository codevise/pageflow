import React, {forwardRef} from 'react';
import classNames from 'classnames';
import {
  useContentElementConfigurationUpdate,
  useContentElementEditorState,
  useContentElementLifecycle,
  useFile,
  Figure,
  Image
} from 'pageflow-scrolled/frontend';

import {ScrollButton} from './ScrollButton';
import {useIntersectionObserver} from './useIntersectionObserver'

import styles from './ImageGallery.module.css';

export function ImageGallery({configuration}) {
  const items = configuration.items || [];
  const {isSelected, isEditable} = useContentElementEditorState();

  const {containerRef: scrollerRef, setChildRef, visibleIndex} = useIntersectionObserver({
    threshold: 0.5,
  });

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
      scrollBy(-1);
    }
    else {
      scrollBy(1);
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
                onClick={handleClick}/>
        ))}
      </div>
    </div>
  );
}

const Item = forwardRef(function({item, captions, current, onClick}, ref) {
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
        <Figure caption={caption}
                onCaptionChange={handleCaptionChange}
                addCaptionButtonVisible={current}
                addCaptionButtonPosition="inside">
          <div onClick={onClick}>
            <Image imageFile={imageFile} load={shouldLoad} fill={false} />
          </div>
        </Figure>
      </div>
    </div>
  );
});
