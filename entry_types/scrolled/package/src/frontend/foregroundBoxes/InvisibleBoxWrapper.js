import React from 'react';
import classNames from 'classnames';

import {widths} from '../layouts';
import {TrimMarginTopProvider} from '../TrimMarginTop';
import styles from './InvisibleBoxWrapper.module.css';
import boundaryMarginStyles from './BoxBoundaryMargin.module.css';

export function InvisibleBoxWrapper({position, width, openStart, openEnd, atSectionStart, atSectionEnd, children}) {
  const full = (width === widths.full);

  return (
    <TrimMarginTopProvider value={atSectionStart}>
      <div className={classNames({
        [styles.start]: !openStart && !full,
        [styles.end]: !openEnd && !full,
        [boundaryMarginStyles.noTopMargin]: atSectionStart,
        [boundaryMarginStyles.noBottomMargin]: atSectionEnd
      })}>
        {children}
      </div>
    </TrimMarginTopProvider>
  )
}
