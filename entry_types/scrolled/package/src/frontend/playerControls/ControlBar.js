import React from 'react';
import classNames from 'classnames';

import PlayIcon from '../assets/images/playerControls/play_arrow_24px.svg';
import PauseIcon from '../assets/images/playerControls/pause_24px.svg';
import SubtitlesIcon from '../assets/images/playerControls/subtitles_24px.svg';
import SettingsIcon from '../assets/images/playerControls/settings_24px.svg';

import {ProgressIndicators} from './ProgressIndicators'

import styles from './ControlBar.module.css';

export function ControlBar() {
  return (
    <div className={classNames(styles.controlBarContainer)}>
      <div className={classNames(styles.controlBar)}>
        <div className={classNames(styles.controlsContainer, styles.leftControlsContainer)}>
          <div className={classNames(styles.controls)}>
            <PlayIcon className={classNames(styles.controlsIcon, styles.playButton)}/>
            <PauseIcon className={classNames(styles.controlsIcon, styles.pauseButton)}/>
          </div>
        </div>
        <div className={classNames(styles.controlsContainer, styles.progressDisplayContainer)}>
          <div className={classNames(styles.controls)}>
            <ProgressIndicators/>
          </div>
        </div>
        <div className={classNames(styles.controlsContainer, styles.timeDisplayContainer)}>
          <div className={classNames(styles.controls)}>
              <span className={classNames(styles.timeDisplay)}>0:45</span>
              <span className={classNames(styles.timeDisplay)}>/</span>
              <span className={classNames(styles.timeDisplay)}>2:38</span>
          </div>
        </div>
        <div className={classNames(styles.controlsContainer, styles.rightControlsContainer)}>
          <div className={classNames(styles.controls)}>
            <SettingsIcon className={classNames(styles.controlsIcon, styles.settingsButton)}/>
            <SubtitlesIcon className={classNames(styles.controlsIcon, styles.subtitlesButton)}/>
          </div>
        </div>
      </div>
    </div>
  );
}
