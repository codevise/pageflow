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
  const portraitActiveImageFile = useFile({
    collectionName: 'imageFiles', permaId: props.area.portraitActiveImage
  });

  const imageFile = props.portraitMode && portraitActiveImageFile ?
                    portraitActiveImageFile :
                    activeImageFile

  return (
    <Area {...props}
          className={classNames(styles.area,
                                {[styles.activeImageVisible]: activeImageVisible})}>
      <Image imageFile={imageFile}
             load={shouldLoad}
             variant={panZoomEnabled ? 'ultra' : 'large'}
             preferSvg={true} />
    </Area>
  );
}
