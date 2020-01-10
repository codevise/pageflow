import React from 'react';
import classNames from 'classnames';
import styles from './Image.module.css';

import {useFile} from '../entryState';

export function Image(props) {
  const image = useFile({collectionName: 'imageFiles', permaId: props.id});

  if (image) {
    const focusX = typeof image.configuration.focusX === 'undefined' ? 50 : image.configuration.focusX;
    const focusY = typeof image.configuration.focusY === 'undefined' ? 50 : image.configuration.focusY;

    return (
      <div className={classNames(styles.root,
                                 {[styles.portrait]: props.mobile})}
           role="img"
           style={{
             backgroundImage: `url(${image.urls.large})`,
             backgroundPosition: `${focusX}% ${focusY}%`
           }} />
    );
  }

  return null;
}
