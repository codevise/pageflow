import React from 'react';
import {PlayerControls} from './PlayerControls'

export function MediaPlayerControls(props) {
  const playerState = props.playerState;
  const playerActions = props.playerActions;

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

                    qualityMenuItems={props.qualityMenuItems}
                    onQualityMenuItemClick={props.onQualityMenuItemClick} />
  )
};

MediaPlayerControls.defaultProps = {
  configuration: {},
  sectionProps: {}
}
