import React, {useState} from 'react';
import classNames from 'classnames';

import PlayIcon from '../assets/images/playerControls/play_arrow_24px.svg';
import PauseIcon from '../assets/images/playerControls/pause_24px.svg';
import SubtitlesIcon from '../assets/images/playerControls/subtitles_24px.svg';
import SettingsIcon from '../assets/images/playerControls/settings_24px.svg';

import {ProgressIndicators} from './ProgressIndicators'
import {TimeDisplay} from './TimeDisplay'
import {ContextMenu} from './ContextMenu'

import styles from './ControlBar.module.css';
import themeTransparent from './themes/ControlBarThemeTransparent.module.css';
import themeWhite from './themes/ControlBarThemeWhite.module.css';
import themeBlack from './themes/ControlBarThemeBlack.module.css';

export function ControlBar(props) {
  const [settingsMenuHidden, setSettingsMenuHidden] = useState(true);
  const [subtitlesMenuHidden, setSubtitlesMenuHidden] = useState(true);

  const theme = {
    transparent: themeTransparent,
    white: themeWhite,
    black: themeBlack
  }[props.appearance];

  return (
    <div className={classNames(styles.controlBarContainer,
                               theme.background,
                               {[styles.inset]: !!props.fullWidth})}>
      <div className={classNames(styles.controlBar, theme.foreground)}>
        <div className={styles.controlsContainer}>
          <div className={styles.controls}>
            <PlayIcon className={styles.playButton}/>
            <PauseIcon className={styles.pauseButton}/>
          </div>
        </div>
        <div className={classNames(styles.controlsContainer, styles.progressDisplayContainer)}>
          <div className={styles.controls}>
            <ProgressIndicators/>
          </div>
        </div>
        <div className={classNames(styles.controlsContainer, styles.timeDisplayContainer)}>
          <div className={styles.controls}>
            <TimeDisplay/>
          </div>
        </div>
        <div className={styles.controlsContainer}>
          <div className={styles.controls}>
            <SettingsIcon className={classNames(styles.settingsButton,
                                                {[styles.hidden]: props.type === 'audio'})}
                          onClick={() => setSettingsMenuHidden(!settingsMenuHidden)}/>
            <SubtitlesIcon className={styles.subtitlesButton}
                           onClick={() => setSubtitlesMenuHidden(!subtitlesMenuHidden)}/>
          </div>
        </div>

        <ContextMenu className={classNames(styles.settingsMenu,
                                           {[styles.hidden]: settingsMenuHidden})}
                     theme={theme}
                     entries={['Automatisch', '1024p', '720p']} />
        <ContextMenu className={classNames(styles.subtitlesMenu,
                                           {[styles.hidden]: subtitlesMenuHidden})}
                     theme={theme}
                     entries={['Automatisch', 'Deutsch', 'English']} />
      </div>
    </div>
  );
}

ControlBar.defaultProps = {
  type: 'video',
  appearance: 'transparent',
  fullWidth: false
};
