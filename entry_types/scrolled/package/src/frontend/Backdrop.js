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
import {useBackgroundFile} from './useBackgroundFile';
import {documentHiddenState} from 'pageflow/frontend';
import {useFile} from '../entryState';

import styles from './Backdrop.module.css';

export function Backdrop(props) {
  const [containerDimension, setContainerRef] = useDimension();

  return (
    <div className={classNames(styles.Backdrop,
                               props.transitionStyles.backdrop,
                               props.transitionStyles[`backdrop-${props.state}`])}>
      <div className={props.transitionStyles.backdropInner}>
        <div className={props.transitionStyles.backdropInner2}>
          {props.children(
             <BackgroundAsset {...props}
                              containerDimension={containerDimension}
                              setContainerRef={setContainerRef} />
           )}
        </div>
      </div>
    </div>
  );
}

Backdrop.defaultProps = {
  children: children => children,
  transitionStyles: {}
};

function BackgroundAsset(props) {
  const video = useBackgroundFile({
    file: useFile({collectionName: 'videoFiles', permaId: props.video}),
    motifArea: props.videoMotifArea,
    containerDimension: props.containerDimension
  });
  const image = useBackgroundFile({
    file: useFile({collectionName: 'imageFiles', permaId: props.image}),
    motifArea: props.imageMotifArea,
    containerDimension: props.containerDimension
  });
  const imageMobile = useBackgroundFile({
    file: useFile({collectionName: 'imageFiles', permaId: props.imageMobile}),
    motifArea: props.imageMobileMotifArea,
    containerDimension: props.containerDimension
  });

  if (video) {
    return (
      <Fullscreen ref={props.setContainerRef}>
        <BackgroundVideo video={video}
                         onMotifAreaUpdate={props.onMotifAreaUpdate}
                         containerDimension={props.containerDimension} />
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
        {renderBackgroundImage({image, imageMobile, onMotifAreaUpdate: props.onMotifAreaUpdate, containerDimension: props.containerDimension})}
      </Fullscreen>
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
      <Image imageFile={image} isPrepared={isPrepared} structuredData={true}/>
      <MotifArea key={image?.permaId}
                 onUpdate={onMotifAreaUpdate}
                 file={image}
                 containerWidth={containerDimension.width}
                 containerHeight={containerDimension.height}/>
    </>
  );
}

function BackgroundVideo({video, onMotifAreaUpdate, containerDimension}) {
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
    <>
      <VideoPlayer isPrepared={isPrepared}
                   playerState={playerState}
                   playerActions={playerActions}
                   videoFile={video}
                   textTracksDisabled={true}
                   fit="cover"
                   loop={true}
                   playsInline={true} />
      <MotifArea key={video.permaId}
                 onUpdate={onMotifAreaUpdate}
                 file={video}
                 containerWidth={containerDimension.width}
                 containerHeight={containerDimension.height}/>
    </>
  );
}
