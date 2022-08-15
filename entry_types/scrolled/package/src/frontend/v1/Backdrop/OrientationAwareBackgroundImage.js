import React from 'react';

import {usePortraitOrientation} from '../../usePortraitOrientation';
import {BackgroundImage} from './BackgroundImage';

export function OrientationAwareBackgroundImage({image, onMotifAreaUpdate, imageMobile, containerDimension}) {
  const mobile = usePortraitOrientation();

  if (mobile) {
    return (
      <BackgroundImage image={imageMobile}
                       onMotifAreaUpdate={onMotifAreaUpdate}
                       containerDimension={containerDimension} />
    )
  }
  else {
    return (
      <BackgroundImage image={image}
                       onMotifAreaUpdate={onMotifAreaUpdate}
                       containerDimension={containerDimension} />
    )
  }
}
