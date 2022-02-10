import React, {useRef, useEffect, useCallback} from 'react';
import classNames from 'classnames';

import {media} from 'pageflow/frontend';
import {
  ThemeIcon,
  useMediaMuted,
  useOnUnmuteMedia,
  useI18n,
  useTheme
} from 'pageflow-scrolled/frontend';

import headerStyles from './DefaultNavigation.module.css';
import styles from './ToggleMuteButton.module.css';

export function ToggleMuteButton() {
  const muted = useMediaMuted();
  const {t} = useI18n();

  useUnmuteSound();

  return (
    <div className={classNames({[styles.animate]: !muted})}>
      <button className={classNames(headerStyles.contextIcon, styles.button)}
              title={muted ?
                     t('pageflow_scrolled.public.navigation.unmute') :
                     t('pageflow_scrolled.public.navigation.mute')}
              onClick={() => media.mute(!muted)}>
        {muted ? <ThemeIcon name="muted" /> : <ThemeIcon name="unmuted" />}
      </button>
    </div>
  )
}

function useUnmuteSound() {
  const theme = useTheme();
  const audio = useRef();

  useEffect(() => {
    audio.current = new Audio(theme.assets.unmute)
  }, [theme.assets.unmute]);

  useOnUnmuteMedia(useCallback(() => audio.current.play(), []));
}
