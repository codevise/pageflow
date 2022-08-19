import React from 'react';

import styles from './Placeholder.module.css';

import Icon from './icon.svg';

export function Placeholder({children}) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.row }>
        <div className={styles.avatar}/>
        <div className={styles.info}>
          <div className={styles.name}/>
          <div className={styles.handle}/>
        </div>
        <Icon width={24} height={24} />
      </div>
      {children || <div className={styles.text} />}
    </div>
  )
}
