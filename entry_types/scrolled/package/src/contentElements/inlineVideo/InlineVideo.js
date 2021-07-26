import React from 'react';

import {media} from 'pageflow/frontend';
import {
  VideoPlayer,
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

export function InlineVideo({contentElementId, sectionProps, configuration}) {
  const videoFile = useFile({collectionName: 'videoFiles', permaId: configuration.id});
  const posterImageFile = useFile({collectionName: 'imageFiles', permaId: configuration.posterId});

  const [playerState, playerActions] = usePlayerState();
  const {isEditable, isSelected} = useContentElementEditorState();

  const {shouldLoad, shouldPrepare} = useContentElementLifecycle({
    onActivate() {
      if (configuration.autoplay) {
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

    if (!playerState.shouldPlay || media.muted) {
      playerActions.playBlessed();
    }
    else {
      playerActions.pause();
    }
  };

  return (
    <MediaInteractionTracking playerState={playerState} playerActions={playerActions}>
      <FitViewport file={videoFile}
                                    aspectRatio={videoFile ?
                                                 undefined : fallbackAspectRatio}>
        <Figure caption={configuration.caption}>
          <FitViewport.Content>
            <VideoPlayerControls videoFile={videoFile}
                                 defaultTextTrackFilePermaId={configuration.defaultTextTrackFileId}
                                 playerState={playerState}
                                 playerActions={playerActions}
                                 configuration={configuration}
                                 sectionProps={sectionProps}
                                 onPlayerClick={onPlayerClick}>
              <VideoPlayer load={shouldPrepare ? 'auto' :
                                 shouldLoad ? 'poster' :
                                 'none'}
                           controls={configuration.controls}
                           playerState={playerState}
                           playerActions={playerActions}
                           videoFile={videoFile}
                           posterImageFile={posterImageFile}
                           defaultTextTrackFilePermaId={configuration.defaultTextTrackFileId}
                           quality={'high'}
                           playsInline={true}
                           atmoDuringPlayback={configuration.atmoDuringPlayback} />
            </VideoPlayerControls>
          </FitViewport.Content>
        </Figure>
      </FitViewport>
    </MediaInteractionTracking>
  )
}

const fallbackAspectRatio = 0.5625;
