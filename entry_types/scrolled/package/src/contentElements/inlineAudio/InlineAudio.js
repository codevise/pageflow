import React from 'react';

import {media} from 'pageflow/frontend';

import {
  AudioPlayer,
  AudioPlayerControls,
  Figure,
  useContentElementEditorState,
  usePlayerState,
  useContentElementLifecycle
} from 'pageflow-scrolled/frontend';

export function InlineAudio({sectionProps, configuration}) {
  const [playerState, playerActions] = usePlayerState();
  const {isEditable, isSelected} = useContentElementEditorState();

  const {isPrepared} = useContentElementLifecycle({
    onActivate() {
      if (configuration.autoplay && !media.muted) {
        playerActions.play();
      }
    },

    onDeactivate() {
      playerActions.pause();
    }
  });

  const onPlayerClick = () => {
    if (isEditable && !isSelected) {
      return;
    }

    if (playerState.shouldPlay) {
      playerActions.pause();
    }
    else {
      playerActions.playBlessed();
    }
  };

  return (
    <Figure caption={configuration.caption}>
      <AudioPlayer isPrepared={isPrepared}
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

      <AudioPlayerControls audioFilePermaId={configuration.id}
                           defaultTextTrackFilePermaId={configuration.defaultTextTrackFileId}
                           playerState={playerState}
                           playerActions={playerActions}
                           configuration={configuration}
                           sectionProps={sectionProps}/>
    </Figure>
  )
}
