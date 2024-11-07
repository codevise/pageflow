import React from 'react';

import {Image} from 'pageflow-scrolled/frontend';

import styles from './Thumbnail.module.css';

const aspectRatioPaddings = {
  narrow: '75%',
  square: '100%',
  portrait: '133%'
};

export function Thumbnail({imageFile, aspectRatio, cropPosition, load, children}) {
  imageFile = {
    ...imageFile,
    cropPosition
  };

  const aspectRatioPadding = getAspectRatioPadding(aspectRatio, imageFile);

  return (
    <div className={styles.thumbnail}
         style={{paddingTop: aspectRatioPadding}}>
      <Image imageFile={imageFile}
             load={load}
             variant={(aspectRatioPadding || cropPosition) ? 'medium' : 'linkThumbnailLarge'}  />
      {children}
    </div>
  );
}

function getAspectRatioPadding(aspectRatio, imageFile) {
  if (aspectRatio === 'original' && imageFile) {
    return `${imageFile.height / imageFile.width * 100}%`;
  }
  else {
    return aspectRatioPaddings[aspectRatio];
  }
}
