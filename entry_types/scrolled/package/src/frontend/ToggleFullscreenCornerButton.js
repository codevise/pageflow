import React from 'react';

import {ToggleFullscreenButton} from './ToggleFullscreenButton';

import styles from './ToggleFullscreenCornerButton.module.css';

export function ToggleFullscreenCornerButton(props) {
  return (
    <div className={styles.corner}>
      <ToggleFullscreenButton {...props} />
    </div>
  );
}
