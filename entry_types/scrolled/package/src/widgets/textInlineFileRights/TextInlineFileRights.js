import React, {useEffect} from 'react';
import classNames from 'classnames';
import {useDarkBackground, useContentElementEditorState} from 'pageflow-scrolled/frontend';

import styles from './TextInlineFileRights.module.css';

export function TextInlineFileRights({configuration, context, children}) {
  const darkBackground = useDarkBackground();
  const {setTransientState} = useContentElementEditorState();
  const supported = context !== 'insideElement' && context !== 'playerControls';

  useEffect(() => {
    if (supported) {
      setTransientState({hasFileRights: true});
    }

    return () => {
      if (supported) {
        setTransientState({hasFileRights: false});
      }
    };
  }, [setTransientState, supported]);

  if (!supported) {
    return null;
  }

  return (
    <div className={classNames(styles.text,
                               {[styles.forSection]: context === 'section',
                                [styles.withBackdrop]: context === 'section' ||
                                 configuration.showTextInlineFileRightsBackdrop,
                                [styles.darkBackground]: darkBackground})}>
      <div>
        {children}
      </div>
    </div>
  );
}
