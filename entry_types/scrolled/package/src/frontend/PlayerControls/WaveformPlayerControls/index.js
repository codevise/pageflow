import React from 'react';
import classNames from 'classnames';

import {useDarkBackground} from '../../backgroundColor';
import {Waveform} from './Waveform';
import {TimeDisplay} from '../ClassicPlayerControls/TimeDisplay';
import {TextTracksMenu} from '../ClassicPlayerControls/TextTracksMenu';
import {PlayPauseButton} from '../ClassicPlayerControls/PlayPauseButton'

import styles from './Waveform.module.css';

export function WaveformPlayerControls(props) {
  const darkBackground = useDarkBackground();

  return (
      <div onFocus={props.onFocus}
           onBlur={props.onBlur}
           onMouseEnter={props.onMouseEnter}
           onMouseLeave={props.onMouseLeave}
           data-testid="waveform-controls" 
           className={classNames(styles.container,
                                 darkBackground ? styles.darkBackground : styles.lightBackground)} >
        <div className={styles.playControl}>
          <PlayPauseButton isPlaying={props.isPlaying}
                           play={props.onPlayButtonClick}
                           pause={props.onPauseButtonClick} />
        </div>
        <Waveform isPlaying={props.isPlaying}
                  inverted={!darkBackground}
                  waveformColor={props.waveformColor}
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
