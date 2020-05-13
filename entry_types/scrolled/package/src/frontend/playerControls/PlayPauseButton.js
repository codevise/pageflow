import React from 'react';
import controlBarStyles from "./ControlBar.module.css";
import PlayIcon from "../assets/images/playerControls/play_arrow_24px.svg";
import PauseIcon from "../assets/images/playerControls/pause_24px.svg";

export function PlayPauseButton() {
  return (
    <a>
      <PlayIcon className={controlBarStyles.playButton}/>
      <PauseIcon className={controlBarStyles.pauseButton}/>
    </a>
  );
}