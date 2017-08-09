import PlayButton from './PlayButton';

import {combineSelectors} from 'utils';
import {connectInPage} from 'pages';
import {pageAttribute, pageIsPrepared} from 'pages/selectors';
import {mainColor} from 'theme/selectors';

import Measure from 'react-measure';
import Wavesurfer from 'react-wavesurfer';


const waveColor = 'rgba(170, 170, 170, 1)';
const waveColorForInvertedPage = 'rgba(0, 0, 0, 0.5)';

const cursorColor = '#fff';
const cursorColorForInvertedPage = '#888';

function Waveform(props) {
  if (props.pageIsPrepared && props.mediaElementId) {
    return (
      <Measure whitelist={['height']}>
        { ({height}) =>
          <div className="waveform_player_controls-wave">
            <div className="waveform_player_controls-wave_wrapper">
              <Wavesurfer mediaElt={`#${props.mediaElementId}`}
                          options={{
                            normalize: true,
                            removeMediaElementOnDestroy: false,
                            hideScrollbar: true,
                            progressColor: props.waveformColor || props.mainColor,
                            waveColor: props.inverted ? waveColorForInvertedPage : waveColor,
                            cursorColor: props.inverted ? cursorColorForInvertedPage : cursorColor,
                            height
                          }} />
              <PlayButton isPlaying={props.isPlaying}
                          title={props.playButtonTitle}
                          inverted={props.inverted}
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
