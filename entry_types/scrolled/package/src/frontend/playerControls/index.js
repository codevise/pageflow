import React, {useState} from 'react';
import classNames from 'classnames';

import SubtitlesIcon from '../assets/images/playerControls/subtitles_24px.svg';
import SettingsIcon from '../assets/images/playerControls/settings_24px.svg';

import {PlayPauseButton} from './PlayPauseButton'
import {ProgressIndicators} from './ProgressIndicators'
import {TimeDisplay} from './TimeDisplay'
import {ContextMenu} from './ContextMenu'

import styles from './ControlBar.module.css';
import styleTransparent from './styles/ControlBarTransparent.module.css';
import styleWhite from './styles/ControlBarWhite.module.css';
import styleBlack from './styles/ControlBarBlack.module.css';

export function ControlBar(props) {
  const [settingsMenuHidden, setSettingsMenuHidden] = useState(props.settingsMenuHidden);
  const [subtitlesMenuHidden, setSubtitlesMenuHidden] = useState(props.subtitlesMenuHidden);

  const style = {
    transparent: styleTransparent,
    white: styleWhite,
    black: styleBlack
  }[props.style];

  return (
    <div className={classNames(styles.controlBarContainer,
                               style.background,
                               {[styles.inset]: props.inset})}>
      <div className={classNames(styles.controlBar, style.foreground)}>
        <div className={styles.controlsContainer}>
          <div className={styles.controls}>
            <PlayPauseButton isPlaying={props.isPlaying}
                             play={props.play}
                             playing={props.playing}
                             pause={props.pause}
                             paused={props.paused}/>
          </div>
        </div>
        <div className={classNames(styles.controlsContainer, styles.progressDisplayContainer)}>
          <div className={styles.controls}>
            <ProgressIndicators currentTime={props.currentTime}
                                duration={props.duration}
                                bufferedEnd={props.bufferedEnd}
                                scrubTo={props.scrubTo}/>
          </div>
        </div>
        <div className={classNames(styles.controlsContainer)}>
          <div className={styles.controls}>
            <TimeDisplay currentTime={props.currentTime}
                         duration={props.duration}/>
          </div>
        </div>
        <div className={styles.controlsContainer}>
          <div className={styles.controls}>
            <a>
              <SettingsIcon className={classNames(styles.settingsIcon,
                                                  {[styles.hidden]: props.type === 'audio'})}
                            onClick={() => setSettingsMenuHidden(!settingsMenuHidden)}/>
            </a>
            <ContextMenu className={classNames(styles.settingsMenu,
                                    {[styles.hidden]: settingsMenuHidden})}
                         theme={style}
                         entries={[
                           {
                             label: 'Automatisch',
                             active: true
                           },
                           {
                             label: '1024p',
                             active: false
                           },
                           {
                             label: '720p',
                             active: false
                           }
                         ]}/>
            <a>
              <SubtitlesIcon className={styles.subtitlesIcon}
                             onClick={() => setSubtitlesMenuHidden(!subtitlesMenuHidden)}/>
            </a>
            <ContextMenu className={classNames(styles.subtitlesMenu,
              {[styles.hidden]: subtitlesMenuHidden})}
                         theme={style}
                         entries={[
                           {
                             label: 'Automatisch',
                             active: true
                           },
                           {
                             label: 'Deutsch',
                             active: false
                           },
                           {
                             label: 'English',
                             active: false
                           }
                         ]}/>
          </div>
        </div>
      </div>
    </div>
  );
}

ControlBar.defaultProps = {
  currentTime: 200,
  duration: 600,
  bufferedEnd: 400,
  isPlaying: false,

  play: () => {
  },
  playing: () => {
  },
  pause: () => {
  },
  paused: () => {
  },
  scrubTo: () => {
  },

  type: 'video',
  style: 'transparent',
  inset: false,
  settingsMenuHidden: true,
  subtitlesMenuHidden: true
};
