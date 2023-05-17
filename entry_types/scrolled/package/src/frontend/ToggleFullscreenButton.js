import React from 'react';

import EnterFullscreenIcon from "./icons/enterFullscreen.svg";
import ExitFullscreenIcon from "./icons/exitFullscreen.svg";
import {useI18n} from './i18n';

import styles from './ToggleFullscreenButton.module.css';

export function ToggleFullscreenButton(props) {
  const {t} = useI18n();
  return (
    <button className={styles.button}
            title={t(props.isFullscreen ? 'exit_fullscreen' : 'enter_fullscreen',
                     {scope: 'pageflow_scrolled.public'})}
            onClick={() => props.isFullscreen ?
                         props.onExit() :
                         props.onEnter()}>
      {icon(props)}
    </button>
  );
}

function icon(props) {
  if (props.isFullscreen) {
    return <ExitFullscreenIcon />
  } else {
    return <EnterFullscreenIcon />
  }
}
