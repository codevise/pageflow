import React from 'react';

import {media} from 'pageflow/frontend';

import {
  AudioPlayer,
  AudioPlayerControls,
  Figure,
  useContentElementEditorState,
  useFile,
  usePlayerState,
  useContentElementLifecycle
} from 'pageflow-scrolled/frontend';

export function InlineAudio({sectionProps, configuration}) {
  const audioFile = useFile({collectionName: 'audioFiles', permaId: configuration.id});

  const [playerState, playerActions] = usePlayerState();
  const {isEditable, isSelected} = useContentElementEditorState();

  const {isPrepared} = useContentElementLifecycle({
    onActivate() {
      if (configuration.autoplay && !media.muted) {
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
                   audioFile={audioFile}
                   posterId={configuration.posterId}
                   defaultTextTrackFilePermaId={configuration.defaultTextTrackFileId}
                   quality={'high'}
                   playsInline={true}
                   atmoDuringPlayback={configuration.atmoDuringPlayback}
                   onClick={onPlayerClick} />

      <AudioPlayerControls audioFile={audioFile}
                           defaultTextTrackFilePermaId={configuration.defaultTextTrackFileId}
                           playerState={playerState}
                           playerActions={playerActions}
                           configuration={configuration}
                           sectionProps={sectionProps}/>
    </Figure>
  )
}
