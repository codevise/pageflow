import React from 'react';

import Fullscreen from '../Fullscreen';
import FillColor from '../FillColor';

import {Positioner} from './Positioner';
import {BackgroundImage} from './BackgroundImage';
import {BackgroundVideo} from './BackgroundVideo';

export function BackgroundAsset({backdrop, eagerLoad, state, onMotifAreaUpdate}) {
  if (backdrop.type === 'video') {
    return (
      <Fullscreen>
        <Positioner>
          <BackgroundVideo video={backdrop.file}
                           onMotifAreaUpdate={onMotifAreaUpdate} />
        </Positioner>
      </Fullscreen>
    );
  }
  if (backdrop.type === 'color') {
    return (
      <FillColor color={backdrop.color} />
    );
  }
  else {
    return (
      <Fullscreen>
        <Positioner>
          <BackgroundImage
            backdrop={backdrop}
            eagerLoad={eagerLoad && state === 'active' }
            onMotifAreaUpdate={onMotifAreaUpdate} />
        </Positioner>
      </Fullscreen>
    );
  }
}

BackgroundAsset.defaultProps = {
  eagerLoad: false
};
