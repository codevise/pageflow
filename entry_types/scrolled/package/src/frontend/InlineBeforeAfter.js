import React, {useRef} from 'react';

import BeforeAfter from './BeforeAfter';
import useOnScreen from './useOnScreen';

import styles from './InlineBeforeAfter.module.css';

export default function InlineBeforeAfter(props) {
  const ref = useRef();
  const onScreen = useOnScreen(ref, '-50% 0px -50% 0px');

  return (
    <div ref={ref} className={styles.root}>
      <BeforeAfter {...props}
                   state={onScreen ? 'active' : 'inactive'} />
    </div>
  )
}
