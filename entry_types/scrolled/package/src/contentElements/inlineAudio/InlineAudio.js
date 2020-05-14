import React, {useRef} from 'react';
import classNames from 'classnames';

import {AudioPlayer, useOnScreen} from 'pageflow-scrolled/frontend';

import styles from './InlineAudio.module.css';

export function InlineAudio({configuration}) {
  const ref = useRef();
  const onScreen = useOnScreen(ref, '-50% 0px -50% 0px');

  return (
    <div ref={ref} className={classNames(styles.root)}>
      <div>
        <div className={styles.inner}>
          <AudioPlayer autoplay={configuration.autoplay}
                       controls={configuration.controls}
                       id={configuration.id}
                       state={onScreen ? 'active' : 'inactive'}
                       quality={'high'}
                       interactive={true} 
                       playsInline={true} />
        </div>
      </div>
    </div>
  )
}
