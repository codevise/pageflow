import React, {forwardRef} from 'react';
import classNames from 'classnames';
import {
  useContentElementConfigurationUpdate,
  useContentElementEditorState,
  useFile,
  useI18n,
  utils,
  EditableText,
  Image
} from 'pageflow-scrolled/frontend';

import {ScrollButton} from './ScrollButton';
import {useIntersectionObserver} from './useIntersectionObserver'

import styles from './ImageGallery.module.css';

export function ImageGallery({contentElementId, configuration}) {
  const items = configuration.items || [];

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
                contentElementId={contentElementId} />
        ))}
      </div>
    </div>
  );
}

const Item = forwardRef(function({item, captions, contentElementId, current}, ref) {
  const updateConfiguration = useContentElementConfigurationUpdate();
  const {isSelected} = useContentElementEditorState();
  const {t} = useI18n({locale: 'ui'});
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
      <figure className={styles.figure}>
        <Image imageFile={imageFile} load={true} fill={false} />
        {(isSelected || !utils.isBlankEditableTextValue(caption)) &&
         <figcaption>
           <EditableText value={caption}
                         contentElementId={contentElementId}
                         onChange={handleCaptionChange}
                         onlyParagraphs={true}
                         hyphens="none"
                         placeholder={t('pageflow_scrolled.inline_editing.type_text')} />
         </figcaption>}
      </figure>
    </div>
  );
});
