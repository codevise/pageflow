import React from 'react';
import classNames from 'classnames';
import styles from './Image.module.css';

import {ImageStructuredData} from './ImageStructuredData';

/**
 * Render an image file.
 *
 * @param {Object} props
 * @param {Object} props.imageFile - Image file obtained via `useFile`.
 * @param {string} [props.variant] - Paperclip style to use. Defaults to large.
 * @param {boolean} [props.load] - Whether to load the image. Can be used for lazy loading.
 * @param {boolean} [props.structuredData] - Whether to render a JSON+LD script tag.
 */
export function Image({imageFile, ...props}) {
  if (imageFile && imageFile.isReady && props.load) {
    return (
      <>
        {renderImageTag(props, imageFile)}
        {renderStructuredData(props, imageFile)}
      </>
    );
  }

  return null;
}

function renderImageTag(props, imageFile) {
  const cropPositionX = imageFile.cropPosition ? imageFile.cropPosition.x : 50;
  const cropPositionY = imageFile.cropPosition ? imageFile.cropPosition.y : 50;

  return (
    <img className={classNames(styles.root)}
         src={imageFile.urls[props.variant]}
         alt={imageFile.configuration.alt ? imageFile.configuration.alt : ''}
         style={{
           objectPosition: `${cropPositionX}% ${cropPositionY}%`
         }} />
  );
}

function renderStructuredData(props, file) {
  if (props.structuredData && file) {
    return <ImageStructuredData file={file} />;
  }
}

Image.defaultProps = {
  load: true,
  variant: 'large'
};
