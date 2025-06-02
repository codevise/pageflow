import React from 'react';
import classNames from 'classnames';

import {Image} from 'pageflow-scrolled/frontend';

import styles from './Thumbnail.module.css';

const aspectRatioPaddings = {
  narrow: '75%',
  square: '100%',
  portrait: '133%'
};

export function Thumbnail({imageFile, aspectRatio, cropPosition, fit, load, children}) {
  imageFile = {
    ...imageFile,
    cropPosition
  };

  const aspectRatioPadding = getAspectRatioPadding(aspectRatio, imageFile);

  return (
    <div className={classNames(styles.thumbnail,
                               {[styles.cover]: fit === 'cover'})}
         style={{paddingTop: aspectRatioPadding}}>
      <Image imageFile={imageFile}
             load={load}
             preferSvg={true}
             variant={(aspectRatioPadding || cropPosition || fit === 'contain') ? 'medium' : 'linkThumbnailLarge'}
             fit={fit} />
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
