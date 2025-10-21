import React from 'react';

import styles from './InstagramPlaceholder.module.css';

export function InstagramPlaceholder({children, minHeight}) {
  return (
    <div className={styles.wrapper} style={{minHeight}}>
      <div className={styles.header}>
        <div className={styles.avatar}/>
        <div className={styles.username}/>
      </div>
      <div className={styles.imageContainer}>
        {children || <div className={styles.content} />}
      </div>
      <div className={styles.footer}>
        <div className={styles.textLineShort}></div>
        <div className={styles.textLineMedium}></div>
        <div className={styles.textLineLong}></div>
      </div>
    </div>
  )
}
