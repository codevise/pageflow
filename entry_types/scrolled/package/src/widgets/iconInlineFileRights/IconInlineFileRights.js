import React from 'react';
import classNames from 'classnames';

import {ThemeIcon} from 'pageflow-scrolled/frontend';

import styles from './IconInlineFileRights.module.css';

export function IconInlineFileRights({
  context, playerControlsStandAlone, playerControlsTransparent, children
}) {
  if (context === 'afterElement') {
    return null;
  }

  return (
    <div className={classNames(styles.wrapper, {
      [styles.transparent]: context !== 'playerControls' || playerControlsTransparent,
      [styles.standAlone]: context !== 'playerControls'
    })}>
      <button className={styles.button}>
        <ThemeIcon name="copyright" />
      </button>
      <div className={styles.tooltip}>
        <div className={styles.scroller}>
          {children}
        </div>
      </div>
    </div>
  );
}
