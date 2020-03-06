import React, {useRef} from 'react';

import {BeforeAfter} from './BeforeAfter';
import {useOnScreen} from 'pageflow-scrolled/frontend';

import styles from './InlineBeforeAfter.module.css';

export function InlineBeforeAfter(props) {
  const ref = useRef();
  const onScreen = useOnScreen(ref, '-50% 0px -50% 0px');

  return (
    <div ref={ref} className={styles.root}>
      <BeforeAfter {...props.configuration}
                   state={onScreen ? 'active' : 'inactive'} />
    </div>
  )
}