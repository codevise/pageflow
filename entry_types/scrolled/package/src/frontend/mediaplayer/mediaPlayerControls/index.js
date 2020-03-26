import {PlayerControls} from './PlayerControls';
import WaveformPlayerControls from './waveformPlayerControls';

import classicStyles from './Classic.module.css';
import slimStyles from './Slim.module.css';

export function MediaPlayerControls(props){

  if (props.player_controls == 'slim') {
    return (
      <PlayerControls styles={slimStyles} hintText={props.controlBarText} {...props} />
    );
  }
  else if (props.player_controls == 'classic') {
    
    return (
      <PlayerControls styles={classicStyles} {...props} />
    );
  }
  else if (props.player_controls == 'waveform') {
    return (
      <WaveformPlayerControls {...props} />
    );
  }
  else{
    return null;
  }
}