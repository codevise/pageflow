import React from 'react';
import controlBarStyles from "./ControlBar.module.css";
import PlayIcon from "../assets/images/playerControls/play_arrow_24px.svg";
import PauseIcon from "../assets/images/playerControls/pause_24px.svg";

import {useI18n} from '../i18n';

export function PlayPauseButton(props) {
  const {t} = useI18n();

  return (
    <a className={controlBarStyles.playControl}
       href="#"
       aria-label={t(props.isPlaying ? 'pause' : 'play',
                     {scope: 'pageflow_scrolled.public.player_controls'})}
       onClick={clickHandler(props)}>
      {pausePlayIcon(props)}
    </a>
  );
}

function pausePlayIcon(props) {
  if (props.isPlaying) {
    return <PauseIcon className={controlBarStyles.controlsIcon} />
  } else {
    return <PlayIcon className={controlBarStyles.controlsIcon} />
  }
}

function clickHandler(props) {
  return event => {
    if (props.isPlaying) {
      props.pause();
    } else {
      props.play();
    }

    event.preventDefault();
  };
}
