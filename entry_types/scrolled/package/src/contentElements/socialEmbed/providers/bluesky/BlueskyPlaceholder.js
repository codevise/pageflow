import React from 'react';

import styles from './BlueskyPlaceholder.module.css';

import Icon from './icon.svg';

export function BlueskyPlaceholder({children, minHeight}) {
  return (
    <div className={styles.wrapper} style={{minHeight}}>
      <div className={styles.header}>
        <div className={styles.avatar}/>
        <div className={styles.info}>
          <div className={styles.name}/>
          <div className={styles.handle}/>
        </div>
        <Icon />
      </div>
      {children || <div className={styles.content} />}
    </div>
  )
}
