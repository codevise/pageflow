import React, {useRef} from 'react';
import {AudioPlayer, useOnScreen} from 'pageflow-scrolled/frontend';

import styles from './InlineAudio.module.css';

export function InlineAudio({configuration}) {  
  const ref = useRef();
  const onScreen = useOnScreen(ref, '25% 0px 25% 0px');
  
  return (
    <div ref={ref} className={styles.container}>
      <AudioPlayer {...configuration} onScreen={onScreen} />
    </div>
  );
}
