import React from 'react';
import classNames from 'classnames';

import {ImageStructuredData} from './ImageStructuredData';

import styles from './Picture.module.css';

export function Picture({
  imageFile, imageFileMobile, variant, loading, structuredData
}) {
  if (imageFile && imageFile.isReady) {
    return <>
      {renderTag({imageFile, imageFileMobile, variant, loading})}
      {renderStructuredData({imageFile, structuredData})}
    </>;
  }

  return null;
}

function renderTag({imageFile, imageFileMobile, variant, loading}) {
  return (
    <picture>
      {imageFileMobile &&
       <source srcSet={imageFileMobile.urls[variant]}
               media="(orientation: portrait)" />}
      <img className={classNames(styles.root)}
           loading={loading}
           src={imageFile.urls[variant]}
           alt={imageFile.configuration.alt ? imageFile.configuration.alt : ''} />
    </picture>
  );
}

function renderStructuredData({imageFile, structuredData}) {
  if (structuredData && imageFile) {
    return <ImageStructuredData file={imageFile} />;
  }
}

Picture.defaultProps = {
  variant: 'large'
};
