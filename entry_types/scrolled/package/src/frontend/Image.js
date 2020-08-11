import React from 'react';
import classNames from 'classnames';
import styles from './Image.module.css';

import {ImageStructuredData} from './ImageStructuredData';
import {useFile} from '../entryState';

/**
 * Render an image file.
 *
 * @param {Object} props
 * @param {number} props.id - Perma id of the image file.
 * @param {number} [props.variant] - Paperclip style to use. Defaults to large.
 * @param {boolean} [props.structuredData] - Whether to render a JSON+LD script tag.
 */
export function Image(props) {
  const image = useFile({collectionName: 'imageFiles', permaId: props.id});

  if (image && image.isReady && props.isPrepared) {
    return (
      <>
        {renderImageTag(props, image)}
        {renderStructuredData(props, image)}
      </>
    );
  }

  return null;
}

function renderImageTag(props, image) {
  const focusX = typeof image.configuration.focusX === 'undefined' ? 50 : image.configuration.focusX;
  const focusY = typeof image.configuration.focusY === 'undefined' ? 50 : image.configuration.focusY;

  return (
    <img className={classNames(styles.root)}
         src={image.urls[props.variant]}
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
