import React from 'react';
import classNames from 'classnames';

import {BackgroundColorProvider} from '../backgroundColor';

import styles from "./CardBoxWrapper.module.css";

const positionOutsideBox = ['sticky', 'wide', 'full']

export default function CardBoxWrapper(props) {
  if (positionOutsideBox.includes(props.position) || props.customMargin) {
    return props.children;
  }

  return(
    <div className={className(props)}>
      <BackgroundColorProvider invert>
        {props.children}
      </BackgroundColorProvider>
    </div>
  )
}

function className(props) {
  return classNames(
    styles.card,
    props.inverted ? styles.cardBgBlack : styles.cardBgWhite,
    styles[`selfClear-${props.selfClear}`],
    {[styles.cardStart]: !props.openStart},
    {[styles.cardEnd]: !props.openEnd}
  );
}
