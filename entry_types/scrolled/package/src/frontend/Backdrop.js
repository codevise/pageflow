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
  children: children => children,
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
  else if (props.color ||
           (props.image && props.image.toString().startsWith('#'))) {
    return (
      <FillColor color={props.color || props.image} />
    );
  } else {
    return (
      <Fullscreen ref={setContainerRef}>
        {renderBackgroundImage(props, containerDimension)}
      </Fullscreen>
    );
  }
}

function renderBackgroundImage(props, containerDimension) {
  if (props.image && props.imageMobile) {
    return (
      <OrientationAwareBackgroundImage image={props.image}
                                       imageMobile={props.imageMobile}
                                       onMotifAreaUpdate={props.onMotifAreaUpdate}
                                       containerDimension={containerDimension} />
    );
  }
  else {
    return (
      <BackgroundImage
          image={props.image || props.imageMobile}
          onMotifAreaUpdate={props.onMotifAreaUpdate}
          containerDimension={containerDimension} />
    );
  }
}

function OrientationAwareBackgroundImage({image, onMotifAreaUpdate, imageMobile, containerDimension}) {
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

function BackgroundImage({image, onMotifAreaUpdate, containerDimension}) {
  return (
    <>
      <Image id={image}/>
      <MotifArea key={image}
                 onUpdate={onMotifAreaUpdate}
                 imageId={image}
                 containerWidth={containerDimension.width}
                 containerHeight={containerDimension.height}/>
    </>
  );
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
