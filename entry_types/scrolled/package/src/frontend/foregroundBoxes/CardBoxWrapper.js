import React from 'react';
import styles from "./CardBoxWrapper.module.css";

export default function CardBoxWrapper(props) {
  return(
    <div className={props.inverted ? styles.cardBgBlack : styles.cardBgWhite}>
      {props.children}
    </div>
  )
}