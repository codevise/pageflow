import React from 'react';
import styles from './CardBox.module.css';

export default function CardBox(props) {
  return (
    <div className={styles.wrapper} style={{paddingTop: props.motifAreaState.paddingTop}}>
      <div className={styles.content}>
        {props.children}
      </div>
    </div>
  );
}
