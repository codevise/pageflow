import React from 'react';

import {WaveformPlayerControls} from './WaveformPlayerControls';
import {ClassicPlayerControls} from './ClassicPlayerControls';


export function PlayerControls(props) {
  const ControlComponent = props.variant === 'waveform' ? WaveformPlayerControls : ClassicPlayerControls;

  return (
    <ControlComponent {...props} />
  );
}

PlayerControls.defaultProps = {
  currentTime: 200,
  duration: 600,
  bufferedEnd: 400,
  isPlaying: false,

  play: () => {
  },
  pause: () => {
  },
  scrubTo: () => {
  },
  seekTo: () => {
  },

  inset: false
};

export {ClassicPlayerControls, WaveformPlayerControls}
