import React, {useRef} from 'react';
import classNames from 'classnames';

import {VideoPlayer, useOnScreen, InlineCaption} from 'pageflow-scrolled/frontend';

import styles from './InlineVideo.module.css';

export function InlineVideo({configuration}) {
  const ref = useRef();
  const onScreen = useOnScreen(ref, '-50% 0px -50% 0px');
  
  return (
    <div ref={ref} className={classNames(styles.root)}>
      <div style={{paddingTop: configuration.wideFormat ? '41.15%' : '56.25%'}}>
        <div className={styles.inner}>
          <VideoPlayer autoplay={configuration.autoplay}
                       controls={configuration.controls}
                       id={configuration.id}
                       state={onScreen ? 'active' : 'inactive'}
                       quality={'high'}
                       interactive={true} 
                       playsInline={true} />
        </div>
      </div>
      <InlineCaption text={configuration.caption} />
    </div>
  )
}
