import React from 'react';
import {useMediaSettings, useI18n} from 'pageflow-scrolled/frontend';
import classNames from 'classnames';

import styles from './SoundDisclaimer.module.css';

export function SoundDisclaimer() {
  const mediaSettings = useMediaSettings();
  const {t} = useI18n();

  return (
    <div className={classNames(styles.soundDisclaimer)}
         onClick={() => {
           mediaSettings.setMuted(false);
           mediaSettings.createAudioContext();
         }}>
      <p dangerouslySetInnerHTML={{__html: t('pageflow_scrolled.public.sound_disclaimer.help_text')}} />
    </div>
  );
}
