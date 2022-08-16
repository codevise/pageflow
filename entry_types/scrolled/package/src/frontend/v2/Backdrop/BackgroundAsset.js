import React from 'react';

import Fullscreen from './../../Fullscreen';
import FillColor from './../../FillColor';
import {useBackgroundFile} from './../useBackgroundFile';
import {useFile} from '../../../entryState';

import {BackgroundVideo} from './BackgroundVideo';
import {OrientationAwareBackgroundImage} from './OrientationAwareBackgroundImage';
import {BackgroundImage} from './BackgroundImage';

export function BackgroundAsset(props) {
  const video = useBackgroundFile({
    file: useFile({collectionName: 'videoFiles', permaId: props.video}),
    motifArea: props.videoMotifArea,
    effects: props.effects
  });
  const image = useBackgroundFile({
    file: useFile({collectionName: 'imageFiles', permaId: props.image}),
    motifArea: props.imageMotifArea,
    effects: props.effects
  });
  const imageMobile = useBackgroundFile({
    file: useFile({collectionName: 'imageFiles', permaId: props.imageMobile}),
    motifArea: props.imageMobileMotifArea,
    effects: props.effectsMobile
  });

  if (video) {
    return (
      <Fullscreen>
        <BackgroundVideo video={video}
                         onMotifAreaUpdate={props.onMotifAreaUpdate} />
      </Fullscreen>
    );
  }
  else if (props.color ||
           (props.image && props.image.toString().startsWith('#'))) {
    return (
      <FillColor color={props.color || props.image} />
    );
  } else {
    return (
      <Fullscreen>
        {renderBackgroundImage({image, imageMobile, onMotifAreaUpdate: props.onMotifAreaUpdate})}
      </Fullscreen>
    );
  }
}

function renderBackgroundImage({image, imageMobile, onMotifAreaUpdate}) {
  if (image && imageMobile) {
    return (
      <OrientationAwareBackgroundImage image={image}
                                       imageMobile={imageMobile}
                                       onMotifAreaUpdate={onMotifAreaUpdate} />
    );
  }
  else {
    return (
      <BackgroundImage
          image={image || imageMobile}
          onMotifAreaUpdate={onMotifAreaUpdate} />
    );
  }
}
