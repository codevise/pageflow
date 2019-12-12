import React from 'react';
import styles from "./CardBoxWrapper.module.css";

export default function CardBoxWrapper(props) {
  return(
    <div className={styles.cardBg}>
      {props.children}
    </div>
  )
}