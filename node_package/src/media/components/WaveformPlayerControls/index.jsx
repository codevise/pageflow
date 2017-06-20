import InfoBox from './InfoBox';
import Container from './Container';
import Waveform from './Waveform';
import MenuBar from 'components/PlayerControls/MenuBar';

export default function WaveformPlayerControls(props) {
  return (
    <div className="waveform_player_controls">
      <Container>
        <Waveform isPlaying={props.isPlaying}
                  playButtonTitle={props.playButtonTitle}
                  mediaElementId={props.mediaElementId}
                  onPlayButtonClick={props.onPlayButtonClick}/>
        <InfoBox {...props.infoBox} />
      </Container>

      <MenuBar qualityMenuButtonTitle={props.qualityMenuButtonTitle}
               qualityMenuItems={props.qualityMenuItems}
               onQualityMenuItemClick={props.onQualityMenuItemClick}
               textTracksMenuButtonTitle={props.textTracksMenuButtonTitle}
               textTracksMenuItems={props.textTracksMenuItems}
               hiddenOnPhone={!props.isPlaying}
               onTextTracksMenuItemClick={props.onTextTracksMenuItemClick} />
    </div>
  );
}
