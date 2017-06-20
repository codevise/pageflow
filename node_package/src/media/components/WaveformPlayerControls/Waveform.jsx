import PlayButton from './PlayButton';

import {combineSelectors} from 'utils';
import {connectInPage} from 'pages';
import {pageAttribute, pageIsPrepared} from 'pages/selectors';
import {mainColor} from 'theme/selectors';

import Measure from 'react-measure';
import Wavesurfer from 'react-wavesurfer';

const wavesurferOptions = {
  waveColor: 'rgba(170, 170, 170, 1)',
  cursorColor: '#fff',
  hideScrollbar: true
};

function Waveform(props) {
  if (props.pageIsPrepared && props.mediaElementId) {
    return (
      <Measure whitelist={['height']}>
        { ({height}) =>
          <div className="waveform_player_controls-wave">
            <div className="waveform_player_controls-wave_wrapper">
              <Wavesurfer mediaElt={`#${props.mediaElementId}`}
                          options={{
                            ...wavesurferOptions,
                            progressColor: props.waveformColor || props.mainColor,
                            height
                          }} />
              <PlayButton isPlaying={props.isPlaying}
                          title={props.playButtonTitle}
                          onClick={props.onPlayButtonClick} />
            </div>
          </div>
        }
      </Measure>
    );
  }
  else {
    return null;
  }
}

export default connectInPage(
  combineSelectors({
    pageIsPrepared: pageIsPrepared(),
    waveformColor: pageAttribute('waveformColor'),
    mainColor
  })
)(Waveform);
