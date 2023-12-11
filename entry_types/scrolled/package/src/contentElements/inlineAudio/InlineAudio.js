import React from 'react';

import {media} from 'pageflow/frontend';

import {
  AudioPlayer,
  AudioPlayerControls,
  ContentElementBox,
  ContentElementFigure,
  FitViewport,
  InlineFileRights,
  PlayerEventContextDataProvider,
  useContentElementEditorState,
  useFileWithInlineRights,
  usePlayerState,
  useContentElementLifecycle,
  useAudioFocus
} from 'pageflow-scrolled/frontend';

export function InlineAudio({contentElementId, configuration}) {
  const audioFile = useFileWithInlineRights({
    configuration,
    collectionName: 'audioFiles',
    propertyName: 'id',
  });
  const posterImageFile = useFileWithInlineRights({
    configuration,
    collectionName: 'imageFiles',
    propertyName: 'posterId'
  });

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

  const inlineFileRightsItems = [
    {label: 'audio', file: audioFile},
    {label: 'image', file: posterImageFile}
  ];

  return (
    <FitViewport file={posterImageFile}>
      <ContentElementBox>
        <ContentElementFigure configuration={configuration}>
          <FitViewport.Content>
            <AudioPlayerControls audioFile={audioFile}
                                 defaultTextTrackFilePermaId={configuration.defaultTextTrackFileId}
                                 playerState={playerState}
                                 playerActions={playerActions}
                                 standAlone={!posterImageFile}
                                 inlineFileRightsItems={inlineFileRightsItems}
                                 configuration={configuration}
                                 onPlayerClick={onPlayerClick}>
              <PlayerEventContextDataProvider playerDescription="Inline Audio"
                                              playbackMode={configuration.autoplay ? 'autoplay' : 'manual'}>
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
              </PlayerEventContextDataProvider>
            </AudioPlayerControls>
          </FitViewport.Content>
        </ContentElementFigure>
      </ContentElementBox>
      <InlineFileRights context="afterElement" items={inlineFileRightsItems} />
    </FitViewport>
  )
}
