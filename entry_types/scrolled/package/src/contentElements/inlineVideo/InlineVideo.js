import React, {useEffect} from 'react';

import {media, documentHiddenState} from 'pageflow/frontend';
import {
  VideoPlayer,
  ContentElementBox,
  ContentElementFigure,
  FilePlaceholder,
  MediaInteractionTracking,
  VideoPlayerControls,
  InlineFileRights,
  FitViewport,
  PlayerEventContextDataProvider,
  contentElementBoxProps,
  processImageModifiers,
  useFileWithCropPosition,
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
  const videoFile = useFileWithCropPosition(
    useFileWithInlineRights({
      configuration, collectionName: 'videoFiles', propertyName: 'id'
    }),
    configuration.cropPosition
  );
  const posterImageFile = useFileWithInlineRights({
    configuration,
    collectionName: 'imageFiles',
    propertyName: 'posterId'
  });

  const portraitVideoFile = useFileWithCropPosition(
    useFileWithInlineRights({
      configuration, collectionName: 'videoFiles', propertyName: 'portraitId'
    }),
    configuration.portraitCropPosition
  );
  const portraitPosterImageFile = useFileWithInlineRights({
    configuration,
    collectionName: 'imageFiles',
    propertyName: 'portraitPosterId'
  });

  if (portraitVideoFile) {
    return (
      <OrientationAwareInlineVideo landscapeVideoFile={videoFile}
                                   portraitVideoFile={portraitVideoFile}
                                   landscapeMotifArea={configuration.motifArea}
                                   portraitMotifArea={configuration.portraitMotifArea}
                                   landscapeImageModifiers={configuration.imageModifiers}
                                   portraitImageModifiers={configuration.portraitImageModifiers}
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
                                     imageModifiers={configuration.imageModifiers}
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
  landscapeImageModifiers, portraitImageModifiers,
  contentElementId, configuration,
  sectionProps
}) {
  const portraitOrientation = usePortraitOrientation();
  const videoFile = portraitOrientation && portraitVideoFile ?
                    portraitVideoFile : landscapeVideoFile;
  const motifArea = portraitOrientation && portraitVideoFile ?
                    portraitMotifArea : landscapeMotifArea;
  const imageModifiers = portraitOrientation && portraitVideoFile ?
                         portraitImageModifiers : landscapeImageModifiers;

  const posterImageFile = portraitOrientation && portraitPosterImageFile ?
                          portraitPosterImageFile : landscapePosterImageFile;

  return (
    <OrientationUnawareInlineVideo key={portraitOrientation}
                                   videoFile={videoFile}
                                   motifArea={motifArea}
                                   imageModifiers={imageModifiers}
                                   posterImageFile={posterImageFile}
                                   contentElementId={contentElementId}
                                   sectionProps={sectionProps}
                                   configuration={configuration} />
  );
}

function OrientationUnawareInlineVideo({
  videoFile, posterImageFile, imageModifiers,
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

  const {aspectRatio, rounded} = processImageModifiers(imageModifiers);

  return (
    <MediaInteractionTracking playerState={playerState} playerActions={playerActions}>
      <FitViewport file={videoFile}
                   aspectRatio={aspectRatio}
                   fallbackAspectRatio={fallbackAspectRatio}
                   fill={configuration.position === 'backdrop'}>
        {renderContentElementBox({rounded, configuration},
            <ContentElementFigure configuration={configuration}>
              <FitViewport.Content>
                <FilePlaceholder file={videoFile} />
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
                        configuration={configuration}
                        fit={(aspectRatio || configuration.position === 'backdrop') ? 'cover' : 'contain'}
                        hideControlBar={rounded === 'circle' ||
                                        configuration.hideControlBar ||
                                        configuration.playbackMode === 'loop'}
                        applyContentElementBoxStyles={rounded === 'circle'} />
              </FitViewport.Content>
            </ContentElementFigure>
        )}
        <InlineFileRights configuration={configuration}
                          context="afterElement"
                          items={inlineFileRightsItems} />
      </FitViewport>
    </MediaInteractionTracking>
  )
}

function renderContentElementBox({rounded, configuration}, children) {
  if (rounded === 'circle') {
    const {style, className} = contentElementBoxProps(configuration, {borderRadius: 'circle'});

    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <ContentElementBox borderRadius={rounded}
                       configuration={configuration}>
      {children}
    </ContentElementBox>
  );
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
  sectionProps, fit, hideControlBar,
  applyContentElementBoxStyles
}) {
  const {isEditable, isSelected} = useContentElementEditorState();

  const {shouldLoad, shouldPrepare} = useContentElementLifecycle(
    getLifecycleHandlers({configuration, playerActions, mediaMuted: media.muted})
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
                         fadedOut={sectionProps.isIntersecting}
                         sticky={configuration.position === 'backdrop'}
                         defaultTextTrackFilePermaId={configuration.defaultTextTrackFileId}
                         playerState={playerState}
                         playerActions={playerActions}
                         hideControlBar={hideControlBar}
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
                     fit={fit}
                     playerState={playerState}
                     playerActions={playerActions}
                     videoFile={videoFile}
                     posterImageFile={posterImageFile}
                     defaultTextTrackFilePermaId={configuration.defaultTextTrackFileId}
                     quality={'high'}
                     playsInline={true}
                     atmoDuringPlayback={configuration.atmoDuringPlayback}
                     applyContentElementBoxStyles={applyContentElementBoxStyles} />
      </PlayerEventContextDataProvider>
    </VideoPlayerControls>
  );
}

const fallbackAspectRatio = 0.5625;
