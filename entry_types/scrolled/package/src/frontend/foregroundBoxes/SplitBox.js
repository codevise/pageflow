import React from 'react';
import classNames from 'classnames';

import styles from './SplitBox.module.css';

export default function SplitBox(props) {
  return (
    <div className={styles.wrapper} style={{paddingTop: props.motifAreaState.paddingTop}}>
      {props.motifAreaState.isContentPadded &&
        <div className={classNames(props.inverted ? styles.overlayLight : styles.overlayDark,
                                   props.transitionStyles.foregroundOpacity,
                                   {[styles.long]: props.coverInvisibleNextSection},
                                   props.transitionStyles.boxShadow,
                                   props.transitionStyles[`boxShadow-${props.state}`])}
             style={{
               top: props.motifAreaState.paddingTop,
               ...props.overlayStyle
             }} />}
      <div className={classNames(styles.content, props.transitionStyles.foregroundOpacity)}>
        {props.children}
      </div>
    </div>
  );
}
