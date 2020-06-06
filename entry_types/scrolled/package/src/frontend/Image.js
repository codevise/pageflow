import React from 'react';
import classNames from 'classnames';
import styles from './Image.module.css';

import {useFile} from '../entryState';

/**
 * Render an image file.
 *
 * @param {Object} props
 * @param {number} props.id - Perma id of the image file.
 */
export function Image(props) {
  const image = useFile({collectionName: 'imageFiles', permaId: props.id});

  if (image && props.isPrepared) {
    const focusX = typeof image.configuration.focusX === 'undefined' ? 50 : image.configuration.focusX;
    const focusY = typeof image.configuration.focusY === 'undefined' ? 50 : image.configuration.focusY;

    return (
      <img className={classNames(styles.root)}
           src={image.urls.large}
           style={{
             backgroundPosition: `${focusX}% ${focusY}%`
           }} />
    );
  }

  return null;
}

Image.defaultProps = {
  isPrepared: true
};
