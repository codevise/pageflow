import React from 'react';
import {useMediaSettings} from 'pageflow-scrolled/frontend';
import classNames from 'classnames';

import styles from './SoundDisclaimer.module.css';

export function SoundDisclaimer() {
  const mediaSettings = useMediaSettings();

  return (
    <div className={classNames(styles.soundDisclaimer)}
         onClick={() => mediaSettings.setMuted(false)}>
      <p>
        Dieser Artikel wirkt am besten mit eingeschaltetem Ton.<br/>
        Klicken Sie einmal in dieses Feld, um den Ton für die gesamte Geschichte zu aktivieren.
      </p>
    </div>
  );
}
