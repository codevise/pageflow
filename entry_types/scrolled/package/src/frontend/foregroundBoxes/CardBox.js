import React from 'react';
import styles from './CardBox.module.css';

export default function CardBox(props) {
  const padding = props.active ? props.padding : 0;

  return (
    <div style={{paddingTop: padding}}>
      <div className={styles.wrapper}>
        <div style={{top: padding}} />
        <div className={styles.content}>
          {props.children}
        </div>
      </div>
    </div>
  );
}
