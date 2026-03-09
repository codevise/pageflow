import React from 'react';
import classNames from 'classnames';

import Fullscreen from '../Fullscreen';
import {splitOverlayStyle} from '../splitOverlayStyle';
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
           style={splitOverlayStyle({
             color: props.splitSurfaceColor,
             backdropBlur: props.overlayBackdropBlur
           })}>
        <Fullscreen />
      </div>
      {props.children}
    </div>
  );
}
