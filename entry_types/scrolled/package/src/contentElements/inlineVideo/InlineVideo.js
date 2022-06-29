import React, {useEffect} from 'react';

import {media, documentHiddenState} from 'pageflow/frontend';
import {
  VideoPlayer,
  ContentElementBox,
  Figure,
  MediaInteractionTracking,
  VideoPlayerControls,
  FitViewport,
  useContentElementEditorState,
  useFile,
  usePlayerState,
  useContentElementLifecycle,
  useAudioFocus
} from 'pageflow-scrolled/frontend';

import {MutedIndicator} from './MutedIndicator';

import {
  getLifecycleHandlers,
  getPlayerClickHandler
} from './handlers';

export function InlineVideo({contentElementId, sectionProps, configuration}) {
  const videoFile = useFile({collectionName: 'videoFiles',
                             permaId: configuration.id});

  const posterImageFile = useFile({collectionName: 'imageFiles',
                                   permaId: configuration.posterId});

  const [playerState, playerActions] = usePlayerState();

  return (
    <MediaInteractionTracking playerState={playerState} playerActions={playerActions}>
      <FitViewport file={videoFile}
                   aspectRatio={videoFile ?
                                undefined : fallbackAspectRatio}
                   opaque={!videoFile}>
        <ContentElementBox>
          <Figure caption={configuration.caption}>
            <FitViewport.Content>
              <MutedIndicator visible={media.muted &&
                                       playerState.shouldPlay &&
                                       !configuration.keepMuted} />
              <Player key={configuration.playbackMode === 'loop'}
                      videoFile={videoFile}
                      posterImageFile={posterImageFile}
                      playerState={playerState}
                      playerActions={playerActions}
                      contentElementId={contentElementId}
                      sectionProps={sectionProps}
                      configuration={configuration} />
            </FitViewport.Content>
          </Figure>
        </ContentElementBox>
      </FitViewport>
    </MediaInteractionTracking>
  )
}

function Player({
  videoFile, posterImageFile,
  playerState, playerActions,
  contentElementId, sectionProps, configuration
}) {
  const {isEditable, isSelected} = useContentElementEditorState();

  const {shouldLoad, shouldPrepare} = useContentElementLifecycle(
    getLifecycleHandlers(configuration, playerActions)
  );

  useAudioFocus({
    key: contentElementId,
    request: playerState.shouldPlay,

    onLost() {
      if (configuration.playbackMode !== 'loop') {
        playerActions.fadeOutAndPause(400);
      }
    }
  });

  const onPlayerClick = getPlayerClickHandler({
    configuration,
    playerActions,
    shouldPlay: playerState.shouldPlay,
    lastControlledVia: playerState.lastControlledVia,
    mediaMuted: media.muted,
    isEditable,
    isSelected
  });

  useEffect(() => {
    if (configuration.playbackMode !== 'loop') {
      return;
    }

    let documentState = documentHiddenState((visibilityState) => {
      if (visibilityState === 'hidden') {
        playerActions.fadeOutAndPause(400);
      }
      else{
        playerActions.play();
      }
    });

    return () => documentState.removeCallback();
  }, [playerActions, configuration.playbackMode]);

  return (
    <VideoPlayerControls videoFile={videoFile}
                         defaultTextTrackFilePermaId={configuration.defaultTextTrackFileId}
                         playerState={playerState}
                         playerActions={playerActions}
                         hideControlBar={configuration.hideControlBar ||
                                         configuration.playbackMode === 'loop'}
                         hideBigPlayButton={configuration.playbackMode === 'loop'}
                         configuration={configuration}
                         sectionProps={sectionProps}
                         onPlayerClick={onPlayerClick}>
      <VideoPlayer load={shouldPrepare ? 'auto' :
                         shouldLoad ? 'poster' :
                         'none'}
                   loop={configuration.playbackMode === 'loop'}
                   playerState={playerState}
                   playerActions={playerActions}
                   videoFile={videoFile}
                   posterImageFile={posterImageFile}
                   defaultTextTrackFilePermaId={configuration.defaultTextTrackFileId}
                   quality={'high'}
                   playsInline={true}
                   atmoDuringPlayback={configuration.atmoDuringPlayback} />
    </VideoPlayerControls>
  );
}

const fallbackAspectRatio = 0.5625;
