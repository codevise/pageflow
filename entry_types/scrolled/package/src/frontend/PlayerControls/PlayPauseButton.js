import React from 'react';
import controlBarStyles from "./ControlBar.module.css";
import PlayIcon from "../assets/images/playerControls/play_arrow_24px.svg";
import PauseIcon from "../assets/images/playerControls/pause_24px.svg";

export function PlayPauseButton(props) {
  return (
    <a className={controlBarStyles.playControl}
       href="#"
       onClick={clickHandler(props)}>
      {pausePlayIcon(props)}
    </a>
  );
}

function pausePlayIcon(props) {
  if (props.isPlaying) {
    return <PauseIcon className={controlBarStyles.controlsIcon}
                      data-testid="pause-icon"/>
  } else {
    return <PlayIcon className={controlBarStyles.controlsIcon}
                     data-testid="play-icon"/>
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