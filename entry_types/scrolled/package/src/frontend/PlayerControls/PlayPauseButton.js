import React from 'react';
import controlBarStyles from "./ControlBar.module.css";
import {ThemeIcon} from '../ThemeIcon';

import {useI18n} from '../i18n';

export function PlayPauseButton(props) {
  const {t} = useI18n();
  return (
    <button className={controlBarStyles.playControl}
            aria-label={t(props.isPlaying ? 'pause' : 'play',
                          {scope: 'pageflow_scrolled.public.player_controls'})}
            onClick={() => props.isPlaying ?
                         props.pause({via: 'playPauseButton'}) :
                         props.play({via: 'playPauseButton'})}>
      {pausePlayIcon(props)}
    </button>
  );
}

function pausePlayIcon(props) {
  if (props.isPlaying) {
    return <ThemeIcon name="pause" />
  } else {
    return <ThemeIcon name="play" />
  }
}
