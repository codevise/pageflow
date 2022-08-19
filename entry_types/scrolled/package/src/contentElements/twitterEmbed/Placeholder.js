import React from 'react';

import styles from './Placeholder.module.css';

export function Placeholder() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.upperRow }>
        <div style={{height: "50px", width: "50px", borderRadius: "50%"}} className={styles.item}/>
        <div style={{height: "50%", width: "100%"}} className={styles.item}/>
      </div>
      <div style={{height: "200px", width: "100%"}} className={styles.item} />
    </div>
  )
}
