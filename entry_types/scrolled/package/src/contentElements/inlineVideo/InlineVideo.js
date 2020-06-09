import React from 'react';

import {
  VideoPlayer,
  InlineCaption,
  MediaPlayerControls,
  usePlayerState,
  useContentElementLifecycle
} from 'pageflow-scrolled/frontend';

export function InlineVideo({sectionProps, configuration}) {
  const [playerState, playerActions] = usePlayerState();

  const {isPrepared} = useContentElementLifecycle({
    onActivate() {
      if (configuration.autoplay) {
        playerActions.play();
      }
    },

    onDeactivate() {
      playerActions.fadeOutAndPause(400);
    }
  });

  return (
    <div>
      <VideoPlayer isPrepared={isPrepared}
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

      <InlineCaption text={configuration.caption}/>
    </div>
  )
}
