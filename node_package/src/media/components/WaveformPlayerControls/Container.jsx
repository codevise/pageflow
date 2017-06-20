import {setPageScrollerMarginBottom} from '../../pageScrollerMargin/actions';

import {connectInPage} from 'pages';

import Measure from 'react-measure';

function Container(props) {
  return (
    <Measure whitelist={['height']}
             onMeasure={({height}) => props.setPageScrollerMarginBottom(height)}>
      <div className="waveform_player_controls-container">
        {props.children}
      </div>
    </Measure>
  );
}

export default connectInPage(
  null,
  {
    setPageScrollerMarginBottom
  }
)(Container);
