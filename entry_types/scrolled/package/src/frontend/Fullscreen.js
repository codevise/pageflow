import React from 'react';

import styles from './Fullscreen.module.css';

export default React.forwardRef(function Fullscreen(props, ref) {
  return (
    <div ref={ref} className={styles.root}>
      {props.children}
    </div>
  )
})
