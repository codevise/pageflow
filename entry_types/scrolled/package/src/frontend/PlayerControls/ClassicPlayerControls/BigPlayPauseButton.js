import React from 'react';
import classNames from 'classnames';
import styles from './BigPlayPauseButton.module.css'
import {ThemeIcon} from '../../ThemeIcon';

export function BigPlayPauseButton(props) {
  const c = classNames(styles.button, {
    [styles.hidden]: props.hidden ||
                     props.lastControlledVia === 'playPauseButton',
    [styles.fadeIn]: props.unplayed,
    [styles.animated]: !props.unplayed
  });
  return (
    <div className={classNames(styles.container,
                               {[styles.hideCursor]: props.hideCursor,
                                [styles.hidden]: props.fadedOut,
                                [styles.fadeOutDelay]: props.isPlaying,
                                [styles.pointerCursor]: !!props.onClick})}
         onClick={props.onClick}>
      <div key={props.isPlaying} className={c}>
        {pausePlayIcon(props)}
      </div>
    </div>
  );
}

function pausePlayIcon(props) {
  if (props.unplayed || props.isPlaying) {
    return <ThemeIcon name="play" />;
  }
  else {
    return <ThemeIcon name="pause" />;
  }
}
