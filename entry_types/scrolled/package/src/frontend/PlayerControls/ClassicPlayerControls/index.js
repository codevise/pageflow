import React from 'react';
import classNames from 'classnames';

import {PlayPauseButton} from '../PlayPauseButton'
import {BigPlayPauseButton} from './BigPlayPauseButton'
import {ProgressIndicators} from './ProgressIndicators'
import {TimeDisplay} from '../TimeDisplay'
import {QualityMenu} from './QualityMenu';
import {TextTracksMenu} from '../TextTracksMenu';
import {useDarkBackground} from '../../backgroundColor';

import styles from '../ControlBar.module.css';

export function ClassicPlayerControls(props) {
  const darkBackground = useDarkBackground();
  const transparent = (!props.standAlone && props.unplayed) || (props.isPlaying && props.inactive);

  return (
    <div className={styles.container}>
      {props.children}
      {!props.standAlone &&
       <BigPlayPauseButton unplayed={props.unplayed}
                           isPlaying={props.isPlaying}
                           lastControlledVia={props.lastControlledVia}
                           onClick={props.onPlayerClick} />}
      <div onFocus={props.onFocus}
           onBlur={props.onBlur}
           onMouseEnter={props.onMouseEnter}
           onMouseLeave={props.onMouseLeave}
           className={classNames(styles.controlBarContainer,
                                 darkBackground ? styles.darkBackground : styles.lightBackground,
                                 {
                                   [styles.inset]: !props.standAlone,
                                   [styles.transparent]: transparent
                                 })}>
        <PlayPauseButton isPlaying={props.isPlaying}
                         play={props.play}
                         pause={props.pause}/>
        <ProgressIndicators currentTime={props.currentTime}
                            duration={props.duration}
                            bufferedEnd={props.bufferedEnd}
                            scrubTo={props.scrubTo}
                            seekTo={props.seekTo}/>
        <TimeDisplay currentTime={props.currentTime}
                     duration={props.duration}/>
        <TextTracksMenu items={props.textTracksMenuItems}
                        onItemClick={props.onTextTracksMenuItemClick} />
        <QualityMenu items={props.qualityMenuItems}
                     onItemClick={props.onQualityMenuItemClick}
                     subMenuExpanded={props.qualityMenuExpanded} />
      </div>
    </div>
  );
}
