import React from 'react';

import {
  AudioPlayer,
  MediaPlayerControls,
  usePlayerState,
  useContentElementLifecycle
} from 'pageflow-scrolled/frontend';

import styles from './InlineAudio.module.css';

export function InlineAudio({sectionProps, configuration}) {
  const [playerState, playerActions] = usePlayerState();

  const {isPrepared} = useContentElementLifecycle({
    onActivate() {
      if (configuration.autoplay) {
        playerActions.play();
      }
    },

    onDeactivate() {
      playerActions.pause();
    }
  });

  return (
    <div className={styles.root}>
      <AudioPlayer isPrepared={isPrepared}
                   position={configuration.position}
                   controls={configuration.controls}
                   playerState={playerState}
                   playerActions={playerActions}
                   id={configuration.id}
                   posterId={configuration.posterId}
                   quality={'high'}
                   playsInline={true} />

      <MediaPlayerControls playerState={playerState}
                           playerActions={playerActions}
                           configuration={configuration}
                           sectionProps={sectionProps}/>
    </div>
  )
}
