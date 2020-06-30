import React from 'react';
import classNames from 'classnames';

import styles from "./CardBoxWrapper.module.css";

export default function CardBoxWrapper(props) {
  return(
    <div className={className(props)}>
      {props.children}
    </div>
  )
}

function className(props) {
  if (props.position === 'sticky' || props.position === 'full') {
    return undefined;
  }

  return classNames(
    styles.card,
    props.inverted ? styles.cardBgBlack : styles.cardBgWhite,
    {[styles.cardStart]: !props.openStart},
    {[styles.cardEnd]: !props.openEnd}
  );
}
