import React, {useRef} from 'react';
import classNames from 'classnames';

import {Audio, useOnScreen} from 'pageflow-scrolled/frontend';

import styles from './InlineAudio.module.css';

export function InlineAudio({configuration}) {
  const ref = useRef();
  const onScreen = useOnScreen(ref, '-50% 0px -50% 0px');

  return (
    <div ref={ref} className={classNames(styles.root)}>
      <div>
        <div className={styles.inner}>
          <Audio {...configuration}
                 state={onScreen ? 'active' : 'inactive'}
                 interactive={true} />
        </div>
      </div>
    </div>
  )
}
