import React from 'react';
import classNames from 'classnames';

import {BackgroundColorProvider} from '../backgroundColor';

import styles from "./CardBoxWrapper.module.css";

const positionOutsideBox = ['sticky', 'wide', 'full']

export default function CardBoxWrapper(props) {
  return(
    <div className={className(props)}>
      <BackgroundColorProvider invert={!positionOutsideBox.includes(props.position)}>
        {props.children}
      </BackgroundColorProvider>
    </div>
  )
}

function className(props) {
  if (positionOutsideBox.includes(props.position)) {
    return undefined;
  }

  return classNames(
    styles.card,
    props.inverted ? styles.cardBgBlack : styles.cardBgWhite,
    {[styles.cardStart]: !props.openStart},
    {[styles.cardEnd]: !props.openEnd}
  );
}
