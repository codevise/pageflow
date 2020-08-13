import React from 'react';
import controlBarStyles from "./ControlBar.module.css";
import PlayIcon from "./images/play.svg";
import PauseIcon from "./images/pause.svg";

import {useI18n} from '../i18n';

export function PlayPauseButton(props) {
  const {t} = useI18n();
  return (
    <button className={controlBarStyles.playControl}
            aria-label={t(props.isPlaying ? 'pause' : 'play',
                          {scope: 'pageflow_scrolled.public.player_controls'})}
            onClick={() => props.isPlaying ? props.pause() : props.play()}>
      {pausePlayIcon(props)}
    </button>
  );
}

function pausePlayIcon(props) {
  if (props.isPlaying) {
    return <PauseIcon className={controlBarStyles.controlsIcon} />
  } else {
    return <PlayIcon className={controlBarStyles.controlsIcon} />
  }
}
