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
 * @param {boolean} [props.preferSvg] - Use original if image is SVG.
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
  return (
    <img className={classNames(styles.root)}
         src={imageUrl(imageFile, props)}
         alt={imageFile.configuration.alt ? imageFile.configuration.alt : ''} />
  );
}

function imageUrl(imageFile, {variant, preferSvg}) {
  if (preferSvg && imageFile.extension.toLowerCase() === 'svg') {
    return imageFile.urls.original;
  }
  else {
    return imageFile.urls[variant];
  }
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
