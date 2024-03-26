import React, {useEffect} from 'react';

import {media, documentHiddenState} from 'pageflow/frontend';
import {
  VideoPlayer,
  ContentElementBox,
  ContentElementFigure,
  MediaInteractionTracking,
  VideoPlayerControls,
  InlineFileRights,
  FitViewport,
  PlayerEventContextDataProvider,
  useBackgroundFile,
  useContentElementEditorState,
  useFileWithInlineRights,
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

export function InlineVideo({contentElementId, configuration, sectionProps}) {
  const videoFile = useFileWithInlineRights({
    configuration,
    collectionName: 'videoFiles',
    propertyName: 'id'
  });
  const posterImageFile = useFileWithInlineRights({
    configuration,
    collectionName: 'imageFiles',
    propertyName: 'posterId'
  });

  const portraitVideoFile = useFileWithInlineRights({
    configuration,
    collectionName: 'videoFiles',
    propertyName: 'portraitId'
  });
  const portraitPosterImageFile = useFileWithInlineRights({
    configuration,
    collectionName: 'imageFiles',
    propertyName: 'portraitPosterId'
  });

  // Only render OrientationAwareInlineImage if a portrait image has
  // been selected. This prevents having the component rerender on
  // orientation changes even if it does not depend on orientation at
  // all.
  if (portraitVideoFile) {
    return (
      <OrientationAwareInlineVideo landscapeVideoFile={videoFile}
                                   portraitVideoFile={portraitVideoFile}
                                   landscapeMotifArea={configuration.motifArea}
                                   portraitMotifArea={configuration.portraitMotifArea}
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
                                     motifArea={configuration.motifArea}
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
  landscapeMotifArea, portraitMotifArea,
  contentElementId, configuration,
  sectionProps
}) {
  const portraitOrientation = usePortraitOrientation();
  const videoFile = portraitOrientation && portraitVideoFile ?
                    portraitVideoFile : landscapeVideoFile;
  const motifArea = portraitOrientation && portraitVideoFile ?
                    portraitMotifArea : landscapeMotifArea;

  const posterImageFile = portraitOrientation && portraitPosterImageFile ?
                          portraitPosterImageFile : landscapePosterImageFile;

  return (
    <OrientationUnawareInlineVideo key={portraitOrientation}
                                   videoFile={videoFile}
                                   motifArea={motifArea}
                                   posterImageFile={posterImageFile}
                                   contentElementId={contentElementId}
                                   sectionProps={sectionProps}
                                   configuration={configuration} />
  );
}

function OrientationUnawareInlineVideo({
  videoFile, posterImageFile,
  contentElementId, configuration,
  sectionProps, motifArea
}) {
  const [playerState, playerActions] = usePlayerState();
  const inlineFileRightsItems = [
    {label: 'video', file: videoFile},
    {label: 'poster', file: posterImageFile}
  ];

  const Player = sectionProps?.containerDimension && motifArea ?
                 CropPositionComputingPlayer :
                 PlayerWithControlBar;

  return (
    <MediaInteractionTracking playerState={playerState} playerActions={playerActions}>
      <FitViewport file={videoFile}
                   aspectRatio={videoFile ?
                                undefined : fallbackAspectRatio}
                   fill={configuration.position === 'backdrop'}
                   opaque={!videoFile}>
        <ContentElementBox>
          <ContentElementFigure configuration={configuration}>
            <FitViewport.Content>
              <MutedIndicator visible={media.muted &&
                                       playerState.shouldPlay &&
                                       !configuration.keepMuted} />
              <Player key={configuration.playbackMode === 'loop'}
                      sectionProps={sectionProps}
                      videoFile={videoFile}
                      motifArea={motifArea}
                      posterImageFile={posterImageFile}
                      inlineFileRightsItems={inlineFileRightsItems}
                      playerState={playerState}
                      playerActions={playerActions}
                      contentElementId={contentElementId}
                      configuration={configuration} />
            </FitViewport.Content>
          </ContentElementFigure>
        </ContentElementBox>
        <InlineFileRights context="afterElement" items={inlineFileRightsItems} />
      </FitViewport>
    </MediaInteractionTracking>
  )
}

function CropPositionComputingPlayer({videoFile, motifArea, ...props}) {
  const videoFileWithMotifArea = useBackgroundFile({
    file: videoFile,
    motifArea,
    containerDimension: props.sectionProps.containerDimension
  });

  return (
    <PlayerWithControlBar {...props}
                          videoFile={videoFileWithMotifArea} />
  );
}

function PlayerWithControlBar({
  videoFile, posterImageFile,
  inlineFileRightsItems,
  playerState, playerActions,
  contentElementId, configuration,
  sectionProps
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
                         inlineFileRightsItems={inlineFileRightsItems}
                         configuration={configuration}
                         onPlayerClick={onPlayerClick}>
      <PlayerEventContextDataProvider playerDescription="Inline Video"
                                      playbackMode={configuration.playbackMode ||
                                                    (configuration.autoplay ? 'autoplay' : 'manual')}>
        <VideoPlayer load={shouldPrepare ? 'auto' :
                           shouldLoad ? 'poster' :
                           'none'}
                     loop={configuration.playbackMode === 'loop'}
                     fit={configuration.position === 'backdrop' ? 'cover' : 'contain'}
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
