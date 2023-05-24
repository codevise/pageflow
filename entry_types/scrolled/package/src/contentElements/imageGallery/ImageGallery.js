import React, {forwardRef} from 'react';
import {
  useContentElementConfigurationUpdate,
  useFile,
  useI18n,
  EditableText,
  Image
} from 'pageflow-scrolled/frontend';

import styles from './ImageGallery.module.css';

export function ImageGallery({contentElementId, configuration}) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.items}>
        {(configuration.items || []).map((item, index) => (
          <Item key={item.id}
                item={item}
                captions={configuration.captions || {}}
                contentElementId={contentElementId} />
        ))}
      </div>
    </div>
  );
}

const Item = forwardRef(function({item, captions, contentElementId, current}, ref) {
  const updateConfiguration = useContentElementConfigurationUpdate();
  const {t} = useI18n({locale: 'ui'});

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
    <div className={styles.item} ref={ref}>
      <figure className={styles.figure}>
        <Image imageFile={imageFile} load={true} fill={false} />
        <figcaption>
          <EditableText value={captions[item.id]}
                        contentElementId={contentElementId}
                        onChange={handleCaptionChange}
                        onlyParagraphs={true}
                        hyphens="none"
                        placeholder={t('pageflow_scrolled.inline_editing.type_text')} />
        </figcaption>
      </figure>
    </div>
  );
});
