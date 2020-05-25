import React from 'react';

import Fullscreen from './Fullscreen';

import styles from './FillColor.module.css';

export default function FillColor(props) {
  return (
    <div className={styles.FillColor}
         style={{backgroundColor: props.color}}>
      <Fullscreen />
    </div>
  )
}
