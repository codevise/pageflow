import React from 'react';

import {media} from 'pageflow/frontend';

import {
  AudioPlayer,
  AudioPlayerControls,
  ContentElementBox,
  Figure,
  FitViewport,
  useContentElementEditorState,
  useFile,
  usePlayerState,
  useContentElementLifecycle,
  useAudioFocus
} from 'pageflow-scrolled/frontend';

export function InlineAudio({contentElementId, sectionProps, configuration}) {
  const audioFile = useFile({collectionName: 'audioFiles', permaId: configuration.id});
  const posterImageFile = useFile({collectionName: 'imageFiles', permaId: configuration.posterId});

  const [playerState, playerActions] = usePlayerState();
  const {isEditable, isSelected} = useContentElementEditorState();

  const {shouldLoad, shouldPrepare} = useContentElementLifecycle({
    onActivate() {
      if (configuration.autoplay && !media.muted) {
        playerActions.play();
      }
    },

    onDeactivate() {
      playerActions.fadeOutAndPause(400);
    }
  });

  useAudioFocus({
    key: contentElementId,
    request: playerState.shouldPlay,

    onLost() {
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
    <FitViewport file={posterImageFile}>
      <ContentElementBox>
        <Figure caption={configuration.caption}>
          <FitViewport.Content>
            <AudioPlayerControls audioFile={audioFile}
                                 defaultTextTrackFilePermaId={configuration.defaultTextTrackFileId}
                                 playerState={playerState}
                                 playerActions={playerActions}
                                 standAlone={!posterImageFile}
                                 configuration={configuration}
                                 sectionProps={sectionProps}
                                 onPlayerClick={onPlayerClick}>
              <AudioPlayer load={shouldPrepare ? 'auto' :
                                 shouldLoad ? 'poster' :
                                 'none'}
                           controls={configuration.controls}
                           playerState={playerState}
                           playerActions={playerActions}
                           audioFile={audioFile}
                           posterImageFile={posterImageFile}
                           defaultTextTrackFilePermaId={configuration.defaultTextTrackFileId}
                           quality={'high'}
                           playsInline={true}
                           atmoDuringPlayback={configuration.atmoDuringPlayback} />
            </AudioPlayerControls>
          </FitViewport.Content>
        </Figure>
      </ContentElementBox>
    </FitViewport>
  )
}
