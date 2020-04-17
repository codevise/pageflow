import InfoBox from './InfoBox';
import Container from './Container';
import Waveform from './Waveform';
import MenuBar from 'components/PlayerControls/MenuBar';
import TimesDisplay from './TimesDisplay';

import {combineSelectors} from 'utils';
import {connectInPage} from 'pages';
import {pageAttribute} from 'pages/selectors';

import classNames from 'classnames';

function WaveformPlayerControls(props) {
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
        <InfoBox {...props.infoBox} />
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

export default connectInPage(
  combineSelectors({
    inverted: pageAttribute('invert')
  })
)(WaveformPlayerControls);

function className(props) {
  return classNames('waveform_player_controls', {
    'waveform_player_controls-inverted': props.inverted
  });
}
