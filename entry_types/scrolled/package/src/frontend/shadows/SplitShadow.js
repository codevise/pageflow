import React from 'react';
import classNames from 'classnames';

import Fullscreen from '../Fullscreen';
import styles from './SplitShadow.module.css';

export default function SplitShadow(props) {
  if (props.motifAreaState.isContentPadded) {
    return (
      <div>
        {props.children}
      </div>
    );
  }

  return (
    <div className={classNames(styles.wrapper,
                               styles[`align-${props.align}`],
                               props.inverted ? styles.light : styles.dark)}>
      <div className={styles.overlay}
           style={props.overlayStyle}>
        <Fullscreen />
      </div>
      {props.children}
    </div>
  );
}
