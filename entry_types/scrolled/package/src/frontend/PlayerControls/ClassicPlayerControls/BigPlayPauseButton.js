import React from 'react';
import classNames from 'classnames';
import styles from './BigPlayPauseButton.module.css'
import {ThemeIcon} from '../../ThemeIcon';
import {useI18n} from '../../i18n';
import {usePassFocus} from './useFocusHandoff';

export function BigPlayPauseButton(props) {
  const {t} = useI18n();

  const c = classNames(styles.button, {
    [styles.hidden]: props.hidden ||
                     props.lastControlledVia === 'playPauseButton',
    [styles.fadeIn]: props.unplayed,
    [styles.animated]: !props.unplayed
  });

  const inert = props.hidden || !props.unplayed;

  const ref = usePassFocus(inert, props.focusHandoff);

  return (
    <div className={classNames(styles.container,
                               {[styles.hideCursor]: props.hideCursor,
                                [styles.hidden]: props.fadedOut,
                                [styles.fadeOutDelay]: props.isPlaying,
                                [styles.pointerCursor]: !!props.onClick})}
         onClick={props.onClick}>
      <button key={props.isPlaying}
              ref={ref}
              className={c}
              aria-label={t('pageflow_scrolled.public.player_controls.play')}
              inert={inert ? 'true' : undefined}>
        {pausePlayIcon(props)}
      </button>
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
