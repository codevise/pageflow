import React, {useState} from 'react';
import classNames from 'classnames';

import SubtitlesIcon from '../assets/images/playerControls/subtitles_24px.svg';
import SettingsIcon from '../assets/images/playerControls/settings_24px.svg';

import {PlayPauseButton} from './PlayPauseButton'
import {ProgressIndicators} from './ProgressIndicators'
import {TimeDisplay} from './TimeDisplay'
import {ContextMenu} from './ContextMenu'

import styles from './ControlBar.module.css';

export function PlayerControls(props) {
  const [settingsMenuHidden, setSettingsMenuHidden] = useState(props.settingsMenuHidden);
  const [subtitlesMenuHidden, setSubtitlesMenuHidden] = useState(props.subtitlesMenuHidden);

  return (
    <div onFocus={props.onFocus}
         onBlur={props.onBlur}
         onMouseEnter={props.onMouseEnter}
         onMouseLeave={props.onMouseLeave}
         className={classNames(styles.controlBarContainer,
                               styles.backgroundColor,
                               {
                                 [styles.inset]: props.inset,
                                 [styles.transparent]: props.isPlaying && props.inset && props.inactive
                               })}>
      <div className={classNames(styles.controlBar,
                                 props.style === 'white' ? styles.foregroundLight : styles.foregroundDark)}>
        <div className={styles.controlsContainer}>
          <div className={styles.controls}>
            <PlayPauseButton isPlaying={props.isPlaying}
                             play={props.play}
                             pause={props.pause}/>
          </div>
        </div>
        <div className={classNames(styles.controlsContainer, styles.progressDisplayContainer)}>
          <div className={styles.controls}>
            <ProgressIndicators currentTime={props.currentTime}
                                duration={props.duration}
                                bufferedEnd={props.bufferedEnd}
                                scrubTo={props.scrubTo}
                                seekTo={props.seekTo}/>
          </div>
        </div>
        <div className={classNames(styles.controlsContainer)}>
          <div className={styles.controls}>
            <TimeDisplay currentTime={props.currentTime}
                         duration={props.duration}/>
          </div>
        </div>
        <div className={classNames(styles.controlsContainer, styles.contextMenues)}>
          <div className={styles.controls}>
            <a>
              <SettingsIcon className={classNames(styles.settingsIcon,
                                                  {[styles.hidden]: props.type === 'audio'})}
                            onClick={() => setSettingsMenuHidden(!settingsMenuHidden)}/>
            </a>
            <ContextMenu className={classNames(styles.settingsMenu,
                                    {[styles.hidden]: settingsMenuHidden})}
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

PlayerControls.defaultProps = {
  currentTime: 200,
  duration: 600,
  bufferedEnd: 400,
  isPlaying: false,

  play: () => {
  },
  pause: () => {
  },
  scrubTo: () => {
  },
  seekTo: () => {
  },

  type: 'video',
  style: 'white',
  inset: false,
  settingsMenuHidden: true,
  subtitlesMenuHidden: true
};
