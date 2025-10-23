import React from 'react';
import styles from './TiktokPlaceholder.module.css';

export function TiktokPlaceholder({children, minHeight}) {
  return (
    <div className={styles.container} style={minHeight ? {minHeight: `${minHeight}px`} : {}}>
      <div className={styles.header}>
        <div className={styles.avatar}></div>
        <div className={styles.userInfo}>
          <div className={styles.username}></div>
          <div className={styles.displayName}></div>
        </div>
        <div className={styles.viewProfileButton}></div>
      </div>
      <div className={styles.videoArea}>
        {children || <div className={styles.video} />}
        </div>
        <div className={styles.watchBar}></div>
        <div className={styles.footer}>
          <div className={styles.textLineShort}></div>
          <div className={styles.textLineMedium}></div>
          <div className={styles.textLineLong}></div>
        </div>
      </div>
  );
}
