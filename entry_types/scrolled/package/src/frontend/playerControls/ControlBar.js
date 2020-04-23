import React from 'react';
import classNames from 'classnames';

import PlayIcon from '../assets/images/playerControls/play_arrow_24px.svg';
import PauseIcon from '../assets/images/playerControls/pause_24px.svg';
import SubtitlesIcon from '../assets/images/playerControls/subtitles_24px.svg';
import SettingsIcon from '../assets/images/playerControls/settings_24px.svg';

import {ProgressIndicators} from './ProgressIndicators'
import {TimeDisplay} from './TimeDisplay'
import {ContextMenu} from './ContextMenu'

import styles from './ControlBar.module.css';

export function ControlBar(props) {
  return (
    <div className={classNames(styles.controlBarContainer)}>
      <div className={classNames(styles.controlBar)}>
        <div className={classNames(styles.controlsContainer)}>
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
            <TimeDisplay/>
          </div>
        </div>
        <div className={classNames(styles.controlsContainer)}>
          <div className={classNames(styles.controls)}>
            <SettingsIcon className={classNames(styles.controlsIcon, styles.settingsButton)}/>
            <SubtitlesIcon className={classNames(styles.controlsIcon, styles.subtitlesButton)}/>
          </div>
        </div>

        <ContextMenu settings={true} entries={['Automatisch', '1024p', '720p']} />
        <ContextMenu subtitles={true} entries={['Automatisch', 'Deutsch', 'English']} />
      </div>
    </div>
  );
}
