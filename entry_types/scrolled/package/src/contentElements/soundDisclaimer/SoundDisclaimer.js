import React from 'react';
import {useI18n} from 'pageflow-scrolled/frontend';
import classNames from 'classnames';
import {media} from 'pageflow/frontend';
import styles from './SoundDisclaimer.module.css';

export function SoundDisclaimer() {
  const {t} = useI18n();

  return (
    <div className={classNames(styles.soundDisclaimer)}
         onClick={() => media.mute(false)}>
      <p dangerouslySetInnerHTML={{__html: t('pageflow_scrolled.public.sound_disclaimer.help_text')}} />
    </div>
  );
}
