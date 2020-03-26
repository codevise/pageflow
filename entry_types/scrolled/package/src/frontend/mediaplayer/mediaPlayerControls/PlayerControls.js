import React, {useLayoutEffect} from 'react';

import Container from './Container';
import CurrentTime from './CurrentTime';
import TimeDivider from './TimeDivider';
import Duration from './Duration';
import ProgressSlider from './ProgressSlider';
import PlayButton from './PlayButton';
import LoadingSpinner from './LoadingSpinner';
import MenuBar from './MenuBar';

import classNames from 'classnames/bind';
import styles from './PlayerControls.module.css';

let cx = classNames.bind(styles);

export function PlayerControls(props) {
  
  useLayoutEffect(()=>{
    if (props.player_controls == 'slim') {
      $('.vjs-text-track-display > div > div').css({"top": "175px"})
    }
    else if (props.player_controls == 'classic') {
      $('.vjs-text-track-display > div > div').css({"top": "155px"})
    }
  })
  
  return (
    <Container className={cx(styles.container, props.styles.container)} {...props}>
      
      <div className={controlBarClassNames(props)}>
        {renderLoadingSpinner(props)}
        <div className={classNames(styles.play_button, props.styles.play_button)}>
          <PlayButton title={props.isPlaying? "Pause":"Play"}
                      iconName={props.isPlaying? "pause":"play"}
                      width={30}
                      height={30}
                      isPlaying={props.isPlaying}
                      onClick={props.onPlayButtonClick} />
        </div>
        {renderProgress(props)}
        <div className={cx("control_bar_text", styles.control_bar_text, {control_bar_text_paused: (props.isPlaying || !props.canPlay || props.firstPlay )})}>
          {props.hintText}
        </div>
      </div>

      <MenuBar standAlone={false}
               isPlaying={props.isPlaying}
               additionalButtons={props.additionalMenuBarButtons}
               onAdditionalButtonClick={props.onAdditionalButtonClick}
               onAdditionalButtonMouseEnter={props.onAdditionalButtonMouseEnter}
               onAdditionalButtonMouseLeave={props.onAdditionalButtonMouseLeave}
               qualityMenuButtonTitle={props.qualityMenuButtonTitle}
               qualityMenuItems={props.qualityMenuItems}
               onQualityMenuItemClick={props.onQualityMenuItemClick}
               textTracksMenuButtonTitle={props.textTracksMenuButtonTitle}
               textTracksMenuItems={props.textTracksMenuItems}
               onTextTracksMenuItemClick={props.onTextTracksMenuItemClick}
               styles={props.styles} />

    </Container>
  )
}

function controlBarClassNames(props) {
  return classNames('vjs-control-bar', styles.control_bar, props.styles.control_bar, {
    'with_quality_menu_present': props.qualityMenuItems && props.qualityMenuItems.length >= 2,
    'with_text_tracks_menu_present': props.textTracksMenuItems && props.textTracksMenuItems.length >= 2
  });
}

function renderLoadingSpinner(props) {
  if (props.isLoading) {
    return (
      <LoadingSpinner width={45}
                      height={45}
                      {...props} />
    );
  }
}

function renderProgress(props) {
  if (props.hasProgress) {
    return (
      <div className={classNames("player_controls-progress", styles.controls_progress, props.styles.controls_progress)}>
        <CurrentTime {...props} />
        <TimeDivider {...props}/>
        <Duration {...props} />
        <ProgressSlider {...props} />
      </div>
    );
  }
}