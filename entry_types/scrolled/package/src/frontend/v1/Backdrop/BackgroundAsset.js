import React from 'react';

import Fullscreen from './../../Fullscreen';
import FillColor from './../../FillColor';
import {useBackgroundFile} from './../useBackgroundFile';

import {BackgroundVideo} from './BackgroundVideo';
import {BackgroundImage} from './BackgroundImage';
import {BackgroundContentElement} from './BackgroundContentElement';

export function BackgroundAsset(props) {
  const backgroundFile = useBackgroundFile({
    file: props.backdrop.video || props.backdrop.image,
    motifArea: props.backdrop.motifArea,
    effects: props.backdrop.effects,
    containerDimension: props.containerDimension
  });

  if (props.backdrop.contentElement) {
    return (
      <Fullscreen ref={props.setContainerRef}>
        <BackgroundContentElement
          contentElement={props.backdrop.contentElement}
          onMotifAreaUpdate={props.onMotifAreaUpdate}
          containerDimension={props.containerDimension}
          isIntersecting={props.motifAreaState.isMotifIntersected} />
      </Fullscreen>
    );
  }
  else if (props.backdrop.video) {
    return (
      <Fullscreen ref={props.setContainerRef}>
        <BackgroundVideo
          video={backgroundFile}
          onMotifAreaUpdate={props.onMotifAreaUpdate}
          containerDimension={props.containerDimension} />
      </Fullscreen>
    );
  }
  else if (props.backdrop.color) {
    return (
      <FillColor color={props.backdrop.color} />
    );
  } else {
    return (
      <Fullscreen ref={props.setContainerRef}>
        <BackgroundImage
          image={backgroundFile}
          onMotifAreaUpdate={props.onMotifAreaUpdate}
          containerDimension={props.containerDimension} />
      </Fullscreen>
    );
  }
}
