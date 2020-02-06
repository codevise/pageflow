import React, {useRef} from 'react';
import classNames from 'classnames';

import {Video, useOnScreen} from 'pageflow-scrolled/frontend';

import styles from './InlineVideo.module.css';

export function InlineVideo({configuration}) {
  const ref = useRef();
  const onScreen = useOnScreen(ref, '-50% 0px -50% 0px');

  return (
    <div ref={ref} className={classNames(styles.root)}>
      <div style={{paddingTop: configuration.wideFormat ? '41.15%' : '56.25%'}}>
        <div className={styles.inner}>
          <Video {...configuration}
                 state={onScreen ? 'active' : 'inactive'}
                 interactive={true} />
        </div>
      </div>
    </div>
  )
}
