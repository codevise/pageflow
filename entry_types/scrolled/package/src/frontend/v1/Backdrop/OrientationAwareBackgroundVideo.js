import React from 'react';

import {usePortraitOrientation} from '../../usePortraitOrientation';
import {BackgroundVideo} from './BackgroundVideo';

export function OrientationAwareBackgroundVideo({video, onMotifAreaUpdate, videoMobile, containerDimension}) {
  const mobile = usePortraitOrientation();

  if (mobile) {
    return (
      <BackgroundVideo video={videoMobile}
                       onMotifAreaUpdate={onMotifAreaUpdate}
                       containerDimension={containerDimension} />
    )
  }
  else {
    return (
      <BackgroundVideo video={video}
                       onMotifAreaUpdate={onMotifAreaUpdate}
                       containerDimension={containerDimension} />
    )
  }
}
