import React from 'react';
import classNames from 'classnames';

import InfoBox, {isEmpty as isInfoBoxEmpty} from './InfoBox';
import Container from './Container';
import LoadingSpinner from './LoadingSpinner';
import PlayButton from './PlayButton';
import CurrentTime from './CurrentTime';
import TimeDivider from './TimeDivider';
import Duration from './Duration';
import ProgressSlider from './ProgressSlider';
import MenuBar from './MenuBar';
import withVisibilityWatching from '../withVisibilityWatching';

function PlayerControls(props) {
  return (
    <Container {...props} >
      <span className="hint">{props.hint}</span>

      <InfoBox {...props.infoBox}
               hiddenDuringPlayback={props.infoBoxHiddenDuringPlayback}/>

      <div className={controlBarClassNames(props)}>
        {renderLoadingSpinner(props)}
        <div className="play_button">
          <PlayButton title={props.playButtonTitle}
                      iconName={props.playButtonIconName}
                      isPlaying={props.isPlaying}
                      onClick={props.onPlayButtonClick} />
        </div>
        {renderProgress(props)}
        <div className="control_bar_text">
          {props.controlBarText}
        </div>
      </div>

      <MenuBar standAlone={false}
               additionalButtons={props.additionalMenuBarButtons}
               onAdditionalButtonClick={props.onAdditionalButtonClick}
               onAdditionalButtonMouseEnter={props.onAdditionalButtonMouseEnter}
               onAdditionalButtonMouseLeave={props.onAdditionalButtonMouseLeave}
               qualityMenuButtonTitle={props.qualityMenuButtonTitle}
               qualityMenuItems={props.qualityMenuItems}
               onQualityMenuItemClick={props.onQualityMenuItemClick}
               textTracksMenuButtonTitle={props.textTracksMenuButtonTitle}
               textTracksMenuItems={props.textTracksMenuItems}
               onTextTracksMenuItemClick={props.onTextTracksMenuItemClick} />
    </Container>
  );
}

function renderLoadingSpinner(props) {
  if (props.isLoading) {
    return (
      <LoadingSpinner {...props} />
    );
  }
}

function renderProgress(props) {
  if (props.hasProgress) {
    return (
      <div className="player_controls-progress">
        <CurrentTime {...props} />
        <TimeDivider />
        <Duration {...props} />
        <ProgressSlider {...props} />
      </div>
    );
  }
}

function controlBarClassNames(props) {
  return classNames('vjs-control-bar', {
    'with_quality_menu_present': props.qualityMenuItems && props.qualityMenuItems.length >= 2,
    'with_text_tracks_menu_present': props.textTracksMenuItems && props.textTracksMenuItems.length >= 2
  });
}

PlayerControls.propTypes = {
  isLoading: React.PropTypes.bool,

  hasProgress: React.PropTypes.bool,

  hint: React.PropTypes.string,

  controlBarText: React.PropTypes.string,

  playButtonTitle: React.PropTypes.string,

  infoBox: React.PropTypes.object,

  onPlayButtonClick: React.PropTypes.func
};

export {isInfoBoxEmpty};

export default withVisibilityWatching(PlayerControls);
