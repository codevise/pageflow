import React from 'react';
import classNames from 'classnames';

import styles from './TextInlineFileRights.module.css';

export function TextInlineFileRights({context, children}) {
  if (context === 'insideElement' || context === 'playerControls') {
    return null;
  }

  return (
    <div className={classNames(styles.text,
                               {[styles.forSection]: context === 'section'})}>
      <div>
        {children}
      </div>
    </div>
  );
}
