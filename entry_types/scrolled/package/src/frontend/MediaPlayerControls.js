import React from 'react';
import {PlayerControls} from './PlayerControls'
import {useTextTracks} from './useTextTracks';
import {useI18n} from './i18n';

export function MediaPlayerControls(props) {
  const playerState = props.playerState;
  const playerActions = props.playerActions;

  const {t} = useI18n();
  const textTracks = useTextTracks({
    file: props.file,
    defaultTextTrackFilePermaId: props.defaultTextTrackFilePermaId
  });

  return (
    <PlayerControls inset={props.configuration.position === 'full'}
                    style={props.sectionProps.invert ? 'black' : 'white'}
                    type={props.type}
                    currentTime={playerState.scrubbingAt !== undefined ?
                             playerState.scrubbingAt : playerState.currentTime}
                    bufferedEnd={playerState.bufferedEnd}
                    duration={playerState.duration}

                    isPlaying={playerState.isPlaying}
                    inactive={playerState.userIdle &&
                              !playerState.focusInsideControls &&
                              !playerState.userHoveringControls}

                    onFocus={playerActions.focusEnteredControls}
                    onBlur={playerActions.focusLeftControls}
                    onMouseEnter={playerActions.controlsEntered}
                    onMouseLeave={playerActions.controlsLeft}

                    play={playerActions.playBlessed}
                    pause={playerActions.pause}
                    scrubTo={playerActions.scrubTo}
                    seekTo={playerActions.seekTo}

                    textTracksMenuItems={getTextTracksMenuItems(textTracks, t)}
                    onTextTracksMenuItemClick={textTracks.select}

                    qualityMenuItems={props.qualityMenuItems}
                    onQualityMenuItemClick={props.onQualityMenuItemClick} />
  )
};

MediaPlayerControls.defaultProps = {
  configuration: {},
  sectionProps: {}
}

function getTextTracksMenuItems(textTracks, t) {
  if (!textTracks.files.length) {
    return [];
  }

  return [
    {
      value: 'off',
      label: t('pageflow_scrolled.public.text_track_modes.none'),
      active: textTracks.mode === 'off'
    },
    {
      value: 'auto',
      label: textTracks.autoDisplayLabel,
      active: textTracks.mode === 'auto'
    },
    ...textTracks.files.map(textTrackFile => ({
      value: textTrackFile.id,
      label: textTrackFile.displayLabel,
      active: textTracks.mode === 'user' &&
              textTrackFile.id === textTracks.activeFileId,
    }))
  ];
}
