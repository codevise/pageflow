import React from 'react';
import classNames from 'classnames';
import {useI18n, useMediaMuted, useContentElementEditorState} from 'pageflow-scrolled/frontend';
import {media} from 'pageflow/frontend';
import styles from './SoundDisclaimer.module.css';

import MutedIcon from './muted.svg';
import UnmutedIcon from './unmuted.svg';

export function SoundDisclaimer({configuration}) {
  const {isEditable, isSelected} = useContentElementEditorState();
  const {t} = useI18n();
  const muted = useMediaMuted();

  return (
    <div className={classNames(styles.soundDisclaimer)}
         style={{pointerEvents: isEditable && !isSelected ? 'none' : undefined}}>
      <button className={classNames(styles.unmute, {[styles.active]: muted})}
              onClick={() => media.mute(false)}>
        <MutedIcon />
        <p>
          {configuration.mutedText ||
           t('pageflow_scrolled.public.sound_disclaimer.help_muted')}
        </p>
      </button>
      <div className={classNames(styles.unmuted, {[styles.active]: !muted})}>
        <UnmutedIcon />
        <p>
          {configuration.unmutedText ||
           t('pageflow_scrolled.public.sound_disclaimer.help_unmuted')}
        </p>
      </div>
    </div>
  );
}
