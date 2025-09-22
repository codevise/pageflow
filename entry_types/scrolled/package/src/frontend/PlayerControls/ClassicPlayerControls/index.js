import React from 'react';
import classNames from 'classnames';

import {PlayPauseButton} from '../PlayPauseButton'
import {BigPlayPauseButton} from './BigPlayPauseButton'
import {ProgressIndicators} from './ProgressIndicators'
import {TimeDisplay} from '../TimeDisplay'
import {QualityMenu} from './QualityMenu';
import {TextTracksMenu} from '../TextTracksMenu';
import {InlineFileRights} from '../../InlineFileRights';
import {useDarkBackground} from '../../backgroundColor';

import styles from '../ControlBar.module.css';

export function ClassicPlayerControls(props) {
  const darkBackground = useDarkBackground();

  return (
    <div className={classNames(styles.container,
                               {[styles.sticky]: props.sticky})}>
      {props.children}
      {!props.standAlone &&
       <BigPlayPauseButton unplayed={props.unplayed}
                           isPlaying={props.isPlaying}
                           lastControlledVia={props.lastControlledVia}
                           hidden={props.hideBigPlayButton}
                           fadedOut={props.fadedOut}
                           hideCursor={props.isPlaying && props.inactive}
                           onClick={props.onPlayerClick} />}
      {!props.hideControlBar &&
       renderControlBar(props, darkBackground)}
    </div>
  );
}

function renderControlBar(props, darkBackground) {
  const hidden = (!props.standAlone && props.unplayed) || props.fadedOut;
  const inactive = (props.isPlaying && props.inactive);
  const fadedOut = hidden || inactive;

  return (
    <div onFocus={props.onFocus}
         onBlur={props.onBlur}
         onMouseEnter={props.onMouseEnter}
         onMouseLeave={props.onMouseLeave}
         inert={hidden ? 'true' : undefined}
         className={classNames(styles.controlBarContainer,
                               darkBackground ? styles.darkBackground : styles.lightBackground,
                               {
                                 [styles.inset]: !props.standAlone,
                                 [styles.fadedOut]: fadedOut
                               })}>
      <div className={styles.controlBarInner}>
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
      <InlineFileRights items={props.inlineFileRightsItems}
                        context="playerControls"
                        playerControlsFadedOut={fadedOut}
                        playerControlsStandAlone={props.standAlone} />
    </div>
  );
}
