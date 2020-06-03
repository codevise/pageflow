import React, {useRef} from 'react';
import classNames from 'classnames';

import {AudioPlayer, useOnScreen, usePlayerState, useFile, MediaPlayerControls} from 'pageflow-scrolled/frontend';

import styles from './InlineAudio.module.css';

export function InlineAudio({sectionProps, configuration}) {
  const ref = useRef();
  const onScreen = useOnScreen(ref, '-50% 0px -50% 0px');
  const [playerState, playerActions] = usePlayerState();

  const posterImage = useFile({collectionName: 'imageFiles', permaId: configuration.posterframe_id});
  const posterImageUrl = (posterImage && posterImage.isReady) ? posterImage.urls.medium : ''

  return (
    <div ref={ref} className={classNames(styles.root)}>
      <AudioPlayer position={configuration.position}
                   autoplay={configuration.autoplay}
                   controls={configuration.controls}
                   playerState={playerState}
                   playerActions={playerActions}
                   id={configuration.id}
                   state={onScreen ? 'active' : 'inactive'}
                   quality={'high'}
                   interactive={true}
                   playsInline={true}
                   posterImage={posterImage}
                   posterImageUrl={posterImageUrl}/>

      <MediaPlayerControls playerState={playerState}
                           playerActions={playerActions}
                           configuration={configuration}
                           sectionProps={sectionProps}/>
    </div>
  )
}
