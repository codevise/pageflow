import React, { useEffect } from 'react';
import classNames from 'classnames';

import Fullscreen from './Fullscreen';
import {Image} from './Image';
import {VideoPlayer} from './VideoPlayer';
import FillColor from './FillColor';
import {MotifArea} from './MotifArea';
import useDimension from './useDimension';
import {usePlayerState} from './MediaPlayer/usePlayerState';
import {usePortraitOrientation} from './usePortraitOrientation';
import {useSectionLifecycle} from './useSectionLifecycle';
import {documentHiddenState} from 'pageflow/frontend';

import styles from './Backdrop.module.css';

export function Backdrop(props) {
  const [containerDimension, setContainerRef] = useDimension();

  return (
    <div className={classNames(styles.Backdrop,
                               props.transitionStyles.backdrop,
                               props.transitionStyles[`backdrop-${props.state}`])}>
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
  const {isPrepared} = useSectionLifecycle();

  return (
    <>
      <Image id={image} isPrepared={isPrepared} structuredData={true}/>
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
  const {isPrepared} = useSectionLifecycle({
    onVisible() {
      playerActions.changeVolumeFactor(0, 0);
      playerActions.play()
    },

    onActivate() {
      playerActions.changeVolumeFactor(1, 1000);
    },

    onDeactivate() {
      playerActions.changeVolumeFactor(0, 1000);
    },

    onInvisible() {
      playerActions.pause()
    }
  });
  
  useEffect(() => {
    let documentState = documentHiddenState((visibilityState) => {
      if (visibilityState === 'hidden') {
        playerActions.pause();
      }
      else{
        playerActions.play();
      }
    });
    return () => {
      documentState.removeCallback();
    }
  }, [playerActions])

  return (
    <VideoPlayer isPrepared={isPrepared}
                 playerState={playerState}
                 playerActions={playerActions}
                 id={props.video}
                 textTracksDisabled={true}
                 fit="cover"
                 loop={true}
                 playsInline={true} />
  );
}
