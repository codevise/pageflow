import React from 'react';

import Fullscreen from './../../Fullscreen';
import FillColor from './../../FillColor';
import {useBackgroundFile} from './../useBackgroundFile';
import {useFile} from '../../../entryState';

import {BackgroundVideo} from './BackgroundVideo';
import {OrientationAwareBackgroundImage} from './OrientationAwareBackgroundImage';
import {OrientationAwareBackgroundVideo} from './OrientationAwareBackgroundVideo';
import {BackgroundImage} from './BackgroundImage';

export function BackgroundAsset(props) {
  const video = useBackgroundFile({
    file: useFile({collectionName: 'videoFiles', permaId: props.video}),
    motifArea: props.videoMotifArea,
    containerDimension: props.containerDimension,
    effects: props.effects
  });
  const videoMobile = useBackgroundFile({
    file: useFile({collectionName: 'videoFiles', permaId: props.videoMobile}),
    motifArea: props.videoMobileMotifArea,
    containerDimension: props.containerDimension,
    effects: props.effectsMobile
  });
  const image = useBackgroundFile({
    file: useFile({collectionName: 'imageFiles', permaId: props.image}),
    motifArea: props.imageMotifArea,
    containerDimension: props.containerDimension,
    effects: props.effects
  });
  const imageMobile = useBackgroundFile({
    file: useFile({collectionName: 'imageFiles', permaId: props.imageMobile}),
    motifArea: props.imageMobileMotifArea,
    containerDimension: props.containerDimension,
    effects: props.effectsMobile
  });

  if (video || videoMobile) {
    return (
      <Fullscreen ref={props.setContainerRef}>
        {renderBackgroundVideo({
          video,
          videoMobile,
          onMotifAreaUpdate: props.onMotifAreaUpdate,
          containerDimension: props.containerDimension
        })}
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
      <Fullscreen ref={props.setContainerRef}>
        {renderBackgroundImage({
          image,
          imageMobile,
          onMotifAreaUpdate: props.onMotifAreaUpdate,
          containerDimension: props.containerDimension
        })}
      </Fullscreen>
    );
  }
}

function renderBackgroundVideo({video, videoMobile, onMotifAreaUpdate, containerDimension}) {
  if (video && videoMobile) {
    return (
      <OrientationAwareBackgroundVideo video={video}
                                       videoMobile={videoMobile}
                                       onMotifAreaUpdate={onMotifAreaUpdate}
                                       containerDimension={containerDimension} />
    );
  }
  else {
    return (
      <BackgroundVideo
        video={video || videoMobile}
        onMotifAreaUpdate={onMotifAreaUpdate}
        containerDimension={containerDimension} />
    );
  }
}

function renderBackgroundImage({image, imageMobile, onMotifAreaUpdate, containerDimension}) {
  if (image && imageMobile) {
    return (
      <OrientationAwareBackgroundImage image={image}
                                       imageMobile={imageMobile}
                                       onMotifAreaUpdate={onMotifAreaUpdate}
                                       containerDimension={containerDimension} />
    );
  }
  else {
    return (
      <BackgroundImage
          image={image || imageMobile}
          onMotifAreaUpdate={onMotifAreaUpdate}
          containerDimension={containerDimension} />
    );
  }
}
