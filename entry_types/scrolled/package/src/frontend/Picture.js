import React from 'react';
import classNames from 'classnames';

import {ImageStructuredData} from './ImageStructuredData';

import styles from './Picture.module.css';

export function Picture({
  imageFile, imageFileMobile, variant, structuredData, load,
  preferSvg
}) {
  if (imageFile && imageFile.isReady && load) {
    return <>
      {renderTag({imageFile, imageFileMobile, variant, preferSvg})}
      {renderStructuredData({imageFile, structuredData})}
    </>;
  }

  return null;
}

function renderTag({imageFile, imageFileMobile, variant, preferSvg}) {
  return (
    <picture>
      {imageFileMobile &&
       <source srcSet={imageUrl({imageFile: imageFileMobile, variant, preferSvg})}
               media="(orientation: portrait)" />}
      <img className={classNames(styles.root)}
           src={imageUrl({imageFile, variant, preferSvg})}
           alt={imageFile.configuration.alt ? imageFile.configuration.alt : ''} />
    </picture>
  );
}

function imageUrl({imageFile, variant, preferSvg}) {
  if (preferSvg && imageFile.extension.toLowerCase() === 'svg') {
    return imageFile.urls.original;
  }
  else {
    return imageFile.urls[variant];
  }
}

function renderStructuredData({imageFile, structuredData}) {
  if (structuredData && imageFile) {
    return <ImageStructuredData file={imageFile} />;
  }
}

Picture.defaultProps = {
  load: true,
  variant: 'large'
};
