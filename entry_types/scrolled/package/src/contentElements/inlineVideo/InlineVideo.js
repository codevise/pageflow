import React from 'react';

import {
  VideoPlayer,
  InlineCaption,
  MediaInteractionTracking,
  VideoPlayerControls,
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
      <MediaInteractionTracking playerState={playerState} playerActions={playerActions}>
        <VideoPlayer isPrepared={isPrepared}
                     position={configuration.position}
                     controls={configuration.controls}
                     playerState={playerState}
                     playerActions={playerActions}
                     id={configuration.id}
                     posterId={configuration.posterId}
                     defaultTextTrackFilePermaId={configuration.defaultTextTrackFileId}
                     quality={'high'}
                     playsInline={true} />

        <VideoPlayerControls videoFilePermaId={configuration.id}
                             defaultTextTrackFilePermaId={configuration.defaultTextTrackFileId}
                             playerState={playerState}
                             playerActions={playerActions}
                             configuration={configuration}
                             sectionProps={sectionProps}/>
      </MediaInteractionTracking>

      <InlineCaption text={configuration.caption}/>
    </div>
  )
}
