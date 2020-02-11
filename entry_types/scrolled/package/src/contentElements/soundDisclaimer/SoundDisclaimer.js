import React from 'react';
import {useMediaSettings} from 'pageflow-scrolled/frontend';
import classNames from 'classnames';

import styles from './SoundDisclaimer.module.css';
import I18n from 'i18n-js';

export function SoundDisclaimer() {
  const mediaSettings = useMediaSettings();

  return (
    <div className={classNames(styles.soundDisclaimer)}
         onClick={() => mediaSettings.setMuted(false)}>
      <p dangerouslySetInnerHTML={{__html: I18n.t('pageflow_scrolled.public.sound_disclaimer.help_text')}} />
    </div>
  );
}
