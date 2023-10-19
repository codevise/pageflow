import React, {useEffect} from 'react';

import {media, documentHiddenState} from 'pageflow/frontend';
import {
  VideoPlayer,
  ContentElementBox,
  ContentElementFigure,
  MediaInteractionTracking,
  VideoPlayerControls,
  FitViewport,
  PlayerEventContextDataProvider,
  useContentElementEditorState,
  useFile,
  usePlayerState,
  useContentElementLifecycle,
  useAudioFocus,
  usePortraitOrientation
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

  const portraitVideoFile = useFile({collectionName: 'videoFiles',
                                     permaId: configuration.portraitId});
  const portraitPosterImageFile = useFile({collectionName: 'imageFiles',
                                           permaId: configuration.portraitPosterId});

  // Only render OrientationAwareInlineImage if a portrait image has
  // been selected. This prevents having the component rerender on
  // orientation changes even if it does not depend on orientation at
  // all.
  if (portraitVideoFile) {
    return (
      <OrientationAwareInlineVideo landscapeVideoFile={videoFile}
                                   portraitVideoFile={portraitVideoFile}
                                   landscapePosterImageFile={posterImageFile}
                                   portraitPosterImageFile={portraitPosterImageFile}
                                   contentElementId={contentElementId}
                                   sectionProps={sectionProps}
                                   configuration={configuration} />
    );
  }
  else {
    return (
      <OrientationUnawareInlineVideo videoFile={videoFile}
                                     posterImageFile={posterImageFile}
                                     contentElementId={contentElementId}
                                     sectionProps={sectionProps}
                                     configuration={configuration} />
    )
  }
}

function OrientationAwareInlineVideo({
  landscapeVideoFile, portraitVideoFile,
  landscapePosterImageFile, portraitPosterImageFile,
  contentElementId, sectionProps, configuration
}) {
  const portraitOrientation = usePortraitOrientation();
  const videoFile = portraitOrientation && portraitVideoFile ?
                    portraitVideoFile : landscapeVideoFile;
  const posterImageFile = portraitOrientation && portraitPosterImageFile ?
                          portraitPosterImageFile : landscapePosterImageFile;

  return (
    <OrientationUnawareInlineVideo key={portraitOrientation}
                                   videoFile={videoFile}
                                   posterImageFile={posterImageFile}
                                   contentElementId={contentElementId}
                                   sectionProps={sectionProps}
                                   configuration={configuration} />
  );
}

function OrientationUnawareInlineVideo({
  videoFile, posterImageFile,
  contentElementId, sectionProps, configuration
}) {
  const [playerState, playerActions] = usePlayerState();

  return (
    <MediaInteractionTracking playerState={playerState} playerActions={playerActions}>
      <FitViewport file={videoFile}
                   aspectRatio={videoFile ?
                                undefined : fallbackAspectRatio}
                   opaque={!videoFile}>
        <ContentElementBox>
          <ContentElementFigure configuration={configuration}>
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
          </ContentElementFigure>
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
      <PlayerEventContextDataProvider playerDescription="Inline Video"
                                      playbackMode={configuration.playbackMode ||
                                                    (configuration.autoplay ? 'autoplay' : 'manual')}>
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
      </PlayerEventContextDataProvider>
    </VideoPlayerControls>
  );
}

const fallbackAspectRatio = 0.5625;
