import React from 'react';
import classNames from 'classnames';

import {widths} from '../layouts';
import styles from './InvisibleBoxWrapper.module.css';

export function InvisibleBoxWrapper({position, width, openStart, openEnd, atSectionStart, atSectionEnd, children}) {
  const full = (width === widths.full);

  return (
    <div className={classNames({
      [styles.start]: !openStart && !full,
      [styles.end]: !openEnd && !full,
      [styles.noTopMargin]: atSectionStart,
      [styles.noBottomMargin]: atSectionEnd
    })}>
      {children}
    </div>
  )
}
