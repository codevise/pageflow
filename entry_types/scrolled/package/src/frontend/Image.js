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
 * @param {boolean} [props.structuredData] - Whether to render a JSON+LD script tag.
 */
export function Image({imageFile, ...props}) {
  if (imageFile && imageFile.isReady && props.isPrepared) {
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
  const focusX = typeof imageFile.configuration.focusX === 'undefined' ? 50 : imageFile.configuration.focusX;
  const focusY = typeof imageFile.configuration.focusY === 'undefined' ? 50 : imageFile.configuration.focusY;

  return (
    <img className={classNames(styles.root)}
         src={imageFile.urls[props.variant]}
         alt={imageFile.configuration.alt ? imageFile.configuration.alt : ''}
         style={{
           objectPosition: `${focusX}% ${focusY}%`
         }} />
  );
}

function renderStructuredData(props, file) {
  if (props.structuredData && file) {
    return <ImageStructuredData file={file} />;
  }
}

Image.defaultProps = {
  isPrepared: true,
  variant: 'large'
};
