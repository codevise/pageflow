import React from 'react';
import classNames from 'classnames';
import {features} from 'pageflow/frontend';

import {Image, FilePlaceholder} from 'pageflow-scrolled/frontend';

import styles from './Thumbnail.module.css';

export function Thumbnail({imageFile, aspectRatio, cropPosition, fit, linkWidth,
                           load, showPlaceholder, children}) {
  imageFile = {
    ...imageFile,
    cropPosition
  };

  const aspectRatioPadding = getAspectRatioPadding(aspectRatio, imageFile);
  const {variant, sizes} = variantAndSizes({aspectRatio, cropPosition, fit, linkWidth});

  return (
    <div className={classNames(styles.thumbnail,
                               {[styles.cover]: fit === 'cover'})}
         style={{paddingTop: aspectRatioPadding}}>
      {showPlaceholder && <FilePlaceholder file={imageFile} />}
      <Image imageFile={imageFile}
             load={load}
             preferSvg={true}
             variant={variant}
             sizes={sizes}
             fit={fit} />
      {children}
    </div>
  );
}

function variantAndSizes({aspectRatio, cropPosition, fit, linkWidth}) {
  const needsUncropped = (aspectRatio && aspectRatio !== 'wide') ||
                         cropPosition ||
                         fit === 'contain';
  const bucket = linkWidthBucket(linkWidth);

  if (!features.isEnabled('image_srcset') || bucket === 'small') {
    return {variant: needsUncropped ? 'medium' : 'linkThumbnailLarge'};
  }

  if (bucket === 'medium') {
    return {
      variant: ['medium', 'large'],
      sizes: '(min-width: 950px) 50vw, 100vw'
    };
  }

  return {variant: ['medium', 'large', 'ultra']};
}

function linkWidthBucket(linkWidth) {
  if (linkWidth === 'xl' || linkWidth === 'xxl') {
    return 'large';
  }
  if (linkWidth === 'm' || linkWidth === 'l') {
    return 'medium';
  }
  return 'small';
}

function getAspectRatioPadding(aspectRatio, imageFile) {
  if (aspectRatio === 'original' && imageFile) {
    return `${imageFile.height / imageFile.width * 100}%`;
  }
}
