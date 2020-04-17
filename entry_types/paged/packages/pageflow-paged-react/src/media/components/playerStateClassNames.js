import classNames from 'classnames';

export default function(playerState) {
  return classNames({
    'is_playing': playerState.shouldPlay,
    'is_playing_delayed': playerState.hasBeenPlayingJustNow,
    'is_paused': !playerState.shouldPlay,
  });
}

