import React from 'react';
import classNames from 'classnames';

import {media} from 'pageflow/frontend';
import {useMediaMuted} from '../useMediaMuted';
import {useI18n} from '../i18n';

import headerStyles from './AppHeader.module.css';
import styles from './ToggleMuteButton.module.css';

import MutedIcon from '../assets/images/navigation/icons/muted.svg';
import UnmutedIcon from '../assets/images/navigation/icons/unmuted.svg';

export function ToggleMuteButton() {
  const muted = useMediaMuted();
  const {t} = useI18n();

  return (
    <button className={classNames(headerStyles.contextIcon, styles.button)}
            title={muted ?
                   t('pageflow_scrolled.public.navigation.unmute') :
                   t('pageflow_scrolled.public.navigation.mute')}
            onClick={() => media.mute(!muted)}>
      {muted ? <MutedIcon /> : <UnmutedIcon />}
    </button>
  )
}
