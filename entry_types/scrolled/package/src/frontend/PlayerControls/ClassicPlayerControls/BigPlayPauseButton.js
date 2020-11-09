import React from 'react';
import classNames from 'classnames';
import styles from './BigPlayPauseButton.module.css'
import PlayIcon from '../images/play.svg';
import PauseIcon from '../images/pause.svg';

export function BigPlayPauseButton(props) {
  const c = classNames(styles.button, {
    [styles.hidden]: props.lastControlledVia === 'playPauseButton',
    [styles.fadeIn]: props.unplayed,
    [styles.animated]: !props.unplayed
  });
  return (
    <div className={classNames(styles.container, {[styles.hideCursor]: props.hideCursor})}
         onClick={props.onClick}>
      <div key={props.isPlaying} className={c}>
        {pausePlayIcon(props)}
      </div>
    </div>
  );
}

function pausePlayIcon(props) {
  if (props.unplayed || props.isPlaying) {
    return <PlayIcon />;
  }
  else {
    return <PauseIcon />
  }
}
