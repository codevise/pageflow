import React from 'react';
import {usePlayerState} from './MediaPlayer';
import {ControlBar} from './playerControls/ControlBar'

export function MediaPlayerControls(props) {
  const [playerState, playerActions] = usePlayerState();

  return (
    <ControlBar type={props.type}
                currentTime={playerState.scrubbingAt !== undefined ?
                             playerState.scrubbingAt : playerState.currentTime}
                bufferedEnd={playerState.bufferedEnd}
                duration={playerState.duration}
                isPlaying={playerState.isPlaying}

                play={playerActions.play}
                playing={playerActions.playing}
                pause={playerActions.pause}
                paused={playerActions.paused}
                scrubTo={playerActions.scrubTo} />
  )
};