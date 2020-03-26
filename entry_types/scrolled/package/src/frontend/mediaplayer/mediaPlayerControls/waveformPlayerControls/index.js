import Container from './Container';
import Waveform from './Waveform';
import MenuBar from '../MenuBar';
import TimesDisplay from './TimesDisplay';

import classNames from 'classnames';

export default function WaveformPlayerControls(props) {
  return (
    <div className={className(props)}>
      <Container>
        <Waveform isPlaying={props.isPlaying}
                  inverted={props.inverted}
                  playButtonTitle={props.playButtonTitle}
                  mediaElementId={props.mediaElementId}
                  onPlayButtonClick={props.onPlayButtonClick} />
        <TimesDisplay currentTime={props.currentTime}
                      duration={props.duration} />
      </Container>

      <MenuBar inverted={props.inverted}
               qualityMenuButtonTitle={props.qualityMenuButtonTitle}
               qualityMenuItems={props.qualityMenuItems}
               onQualityMenuItemClick={props.onQualityMenuItemClick}
               textTracksMenuButtonTitle={props.textTracksMenuButtonTitle}
               textTracksMenuItems={props.textTracksMenuItems}
               hiddenOnPhone={!props.isPlaying}
               onTextTracksMenuItemClick={props.onTextTracksMenuItemClick} />
    </div>
  );
}


function className(props) {
  return classNames('waveform_player_controls', {
    'waveform_player_controls-inverted': props.inverted
  });
}
