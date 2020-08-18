import React from 'react';
import classNames from 'classnames';

import {useDarkBackground} from '../../backgroundColor';
import {Waveform} from './Waveform';
import {TimeDisplay} from '../TimeDisplay';
import {TextTracksMenu} from '../TextTracksMenu';
import {PlayPauseButton} from '../PlayPauseButton'

import styles from './Waveform.module.css';
import controlBarStyles from '../ControlBar.module.css';

export function WaveformPlayerControls(props) {
  const darkBackground = useDarkBackground();

  return (
      <div onFocus={props.onFocus}
           onBlur={props.onBlur}
           onMouseEnter={props.onMouseEnter}
           onMouseLeave={props.onMouseLeave}
           data-testid="waveform-controls" 
           className={classNames(styles.container,
                                 darkBackground ? controlBarStyles.darkBackground : controlBarStyles.lightBackground)} >
        <div className={styles.playControl}>
          <PlayPauseButton isPlaying={props.isPlaying}
                           play={props.play}
                           pause={props.pause} />
        </div>
        <Waveform isPlaying={props.isPlaying}
                  inverted={!darkBackground}
                  waveformColor={props.waveformColor}
                  mainColor={'#e10028'}
                  play={props.play}
                  pause={props.pause}
                  mediaElementId={props.mediaElementId} />
        <div className={styles.timeDisplay}>
          <TimeDisplay currentTime={props.currentTime}
                    duration={props.duration} />
        </div>
        <div className={styles.menus}>
          <TextTracksMenu items={props.textTracksMenuItems}
                          onItemClick={props.onTextTracksMenuItemClick} />
        </div>
      </div>
  );
}
