import React from 'react';
import MutedContext from './MutedContext';
import classNames from 'classnames';

import styles from './SoundDisclaimer.module.css';

export default function UnmuteButton() {
  return (
    <MutedContext.Consumer>
      {mutedSettings =>
        <div className={classNames(styles.soundDisclaimer)}
             onClick={() => mutedSettings.setMuted(false)}>
          <p>
            Dieser Artikel wirkt am besten mit eingeschaltetem Ton.<br/>
            Klicken Sie einmal in dieses Feld, um den Ton für die gesamte Geschichte zu aktivieren.
          </p>
        </div>
      }
    </MutedContext.Consumer>
  );
}
