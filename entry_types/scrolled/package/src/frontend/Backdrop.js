import React from 'react';
import classNames from 'classnames';

import Fullscreen from './Fullscreen';
import {Image} from './Image';
import {VideoPlayer} from './VideoPlayer';
import FillColor from './FillColor';
import {MotifArea} from './MotifArea';
import useDimension from './useDimension';
import {usePlayerState} from './MediaPlayer/usePlayerState';

import styles from './Backdrop.module.css';

export function Backdrop(props) {
  const [containerDimension, setContainerRef] = useDimension();

  return (
    <div className={classNames(styles.Backdrop,
                               props.transitionStyles.backdrop,
                               props.transitionStyles[`backdrop-${props.state}`],
                               {[styles.offScreen]: props.offScreen})}>
      <div className={props.transitionStyles.backdropInner}>
        <div className={props.transitionStyles.backdropInner2}>
          {props.children(renderContent(props, containerDimension, setContainerRef))}
        </div>
      </div>
    </div>
  );
}

Backdrop.defaultProps = {
  transitionStyles: {}
};

function renderContent(props, containerDimension, setContainerRef) {
  if (props.video) {
    return (
      <Fullscreen ref={setContainerRef}>
        <BackgroundVideo {...props} />
      </Fullscreen>
    );
  }
  else if (props.image.toString().startsWith('#')) {
    return (
      <FillColor color={props.image} />
    );
  }
  else {
    return (
      <Fullscreen ref={setContainerRef}>
        <Image id={props.image} />
        <Image id={props.imageMobile} mobile={true} />
        <MotifArea ref={props.motifAreaRef}
                   imageId={props.image}
                   containerWidth={containerDimension.width}
                   containerHeight={containerDimension.height} />
      </Fullscreen>
    );
  }
}

function BackgroundVideo(props) {
  const [playerState, playerActions] = usePlayerState();

  return (
    <VideoPlayer state={props.onScreen ? 'active' : 'inactive'}
                 autoplay={true}
                 playerState={playerState}
                 playerActions={playerActions}
                 id={props.video}
                 offset={props.offset}
                 interactive={props.interactive}
                 nextSectionOnEnd={props.nextSectionOnEnd} />
  );
}
