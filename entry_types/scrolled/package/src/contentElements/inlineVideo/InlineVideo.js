import React from 'react';

import {media} from 'pageflow/frontend';
import {
  VideoPlayer,
  Figure,
  MediaInteractionTracking,
  VideoPlayerControls,
  useContentElementEditorState,
  usePlayerState,
  useContentElementLifecycle
} from 'pageflow-scrolled/frontend';

export function InlineVideo({sectionProps, configuration}) {
  const [playerState, playerActions] = usePlayerState();
  const {isEditable, isSelected} = useContentElementEditorState();

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

  const onPlayerClick = () => {
    if (isEditable && !isSelected) {
      return;
    }

    if (!playerState.shouldPlay || media.muted) {
      playerActions.playBlessed();
    }
    else {
      playerActions.pause();
    }
  };

  return (
    <Figure caption={configuration.caption}>
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
                     playsInline={true}
                     atmoDuringPlayback={configuration.atmoDuringPlayback}
                     onClick={onPlayerClick} />

        <VideoPlayerControls videoFilePermaId={configuration.id}
                             defaultTextTrackFilePermaId={configuration.defaultTextTrackFileId}
                             playerState={playerState}
                             playerActions={playerActions}
                             configuration={configuration}
                             sectionProps={sectionProps}/>
      </MediaInteractionTracking>
    </Figure>
  )
}
