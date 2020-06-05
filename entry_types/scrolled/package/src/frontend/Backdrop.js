import React from 'react';
import classNames from 'classnames';

import Fullscreen from './Fullscreen';
import {Image} from './Image';
import {VideoPlayer} from './VideoPlayer';
import FillColor from './FillColor';
import {MotifArea} from './MotifArea';
import useDimension from './useDimension';
import {usePlayerState} from './MediaPlayer/usePlayerState';
import {usePortraitOrientation} from './usePortraitOrientation';

import styles from './Backdrop.module.css';

export function Backdrop(props) {
  const [containerDimension, setContainerRef] = useDimension();
  const mobile = usePortraitOrientation();

  return (
    <div className={classNames(styles.Backdrop,
                               props.transitionStyles.backdrop,
                               props.transitionStyles[`backdrop-${props.state}`],
                               {[styles.offScreen]: props.offScreen})}>
      <div className={props.transitionStyles.backdropInner}>
        <div className={props.transitionStyles.backdropInner2}>
          {props.children(renderContent(props, containerDimension, setContainerRef, mobile))}
        </div>
      </div>
    </div>
  );
}

Backdrop.defaultProps = {
  children: children => children,
  transitionStyles: {}
};

function renderContent(props, containerDimension, setContainerRef, mobile) {
  if (props.video) {
    return (
      <Fullscreen ref={setContainerRef}>
        <BackgroundVideo {...props} />
      </Fullscreen>
    );
  }
  else if (props.color || props.image.toString().startsWith('#')) {
    return (
      <FillColor color={props.color || props.image} />
    );
  } else {
    return (
      <Fullscreen ref={setContainerRef}>
        {renderBackgroundImageWithMotifArea(props, containerDimension, mobile)}
      </Fullscreen>
    );
  }
}

function renderBackgroundImageWithMotifArea(props, containerDimension, mobile) {
  if (mobile && props.imageMobile) {
    return (
      <div>
        <Image id={props.imageMobile}/>
        <MotifArea key={'motifAreaForImg'+props.imageMobile}
                   ref={props.motifAreaRef}
                   imageId={props.imageMobile}
                   containerWidth={containerDimension.width}
                   containerHeight={containerDimension.height}/>
      </div>
    )
  } else {
    return (
      <div>
        <Image id={props.image}/>
        <MotifArea key={'motifAreaForImg'+props.image}
                   ref={props.motifAreaRef}
                   imageId={props.image}
                   containerWidth={containerDimension.width}
                   containerHeight={containerDimension.height}/>
      </div>
    )
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
                 fit="cover"
                 offset={props.offset}
                 interactive={props.interactive}
                 nextSectionOnEnd={props.nextSectionOnEnd} />
  );
}
