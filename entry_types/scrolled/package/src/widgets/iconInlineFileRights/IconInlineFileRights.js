import React from 'react';
import classNames from 'classnames';

import {AiIndicatorIcon, ThemeIcon, useDarkBackground} from 'pageflow-scrolled/frontend';

import styles from './IconInlineFileRights.module.css';

export function IconInlineFileRights({
  context, position, playerControlsStandAlone, playerControlsFadedOut,
  hasRights, hasAiIndicators, children
}) {
  const darkBackground = useDarkBackground();

  if (context === 'afterElement') {
    return null;
  }

  return (
    <div className={classNames(styles.wrapper, styles[`position-${position || 'bottom'}`], {
      [styles.fadedOut]: context !== 'playerControls' || playerControlsFadedOut,
      [styles.standAlone]: context !== 'playerControls',
      [styles.onLightBackground]: context === 'playerControls' &&
                                  playerControlsStandAlone &&
                                  !darkBackground
    })}>
      <button className={styles.button}>
        {hasAiIndicators && <AiIndicatorIcon kind="ai" className={styles.aiIcon} />}
        {hasRights && <ThemeIcon name="copyright" />}
      </button>
      <div className={styles.tooltip}>
        <div className={styles.scroller}>
          {children}
        </div>
      </div>
    </div>
  );
}
