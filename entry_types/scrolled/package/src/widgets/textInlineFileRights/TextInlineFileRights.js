import React from 'react';
import classNames from 'classnames';
import {useDarkBackground} from 'pageflow-scrolled/frontend';

import styles from './TextInlineFileRights.module.css';

export function TextInlineFileRights({context, children}) {
  const darkBackground = useDarkBackground();

  if (context === 'insideElement' || context === 'playerControls') {
    return null;
  }

  return (
    <div className={classNames(styles.text,
                               {[styles.forSection]: context === 'section',
                                [styles.darkBackground]: darkBackground})}>
      <div>
        {children}
      </div>
    </div>
  );
}
