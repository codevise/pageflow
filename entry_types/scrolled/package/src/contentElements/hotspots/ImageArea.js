import React from 'react';
import classNames from 'classnames';

import {Area} from './Area';

import {
  Image,
  useContentElementLifecycle,
  useFile
} from 'pageflow-scrolled/frontend';

import styles from './ImageArea.module.css';

export function ImageArea({
  panZoomEnabled,
  activeImageVisible,
  ...props
}) {
  const {shouldLoad} = useContentElementLifecycle();

  const activeImageFile = useFile({
    collectionName: 'imageFiles', permaId: props.area.activeImage
  });
  const fallbackActiveImageFile = useFile({
    collectionName: 'imageFiles', permaId: props.area.fallbackActiveImage
  });

  return (
    <Area {...props}
          className={classNames(styles.area,
                                {[styles.activeImageVisible]: activeImageVisible})}>
      <Image imageFile={activeImageFile || fallbackActiveImageFile}
             load={shouldLoad}
             variant={panZoomEnabled ? 'ultra' : 'large'}
             preferSvg={true} />
    </Area>
  );
}
