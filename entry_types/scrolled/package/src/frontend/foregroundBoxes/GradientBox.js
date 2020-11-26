import React from 'react';
import classNames from 'classnames';

import styles from './GradientBox.module.css';

export default function GradientBox(props) {
  return (
    <div className={classNames(styles.root,
                               {
                                 [styles.gradient]: props.motifAreaState.isContentPadded,
                                 [styles.long]: props.coverInvisibleNextSection
                               })}
         style={{paddingTop: props.motifAreaState.paddingTop}}>
      <div className={styles.wrapper}>
        <div className={classNames(styles.shadow,
                                   props.inverted ? styles.shadowLight : styles.shadowDark,
                                   props.transitionStyles.boxShadow,
                                   props.transitionStyles[`boxShadow-${props.state}`])}
             style={{top: props.motifAreaState.paddingTop, opacity: props.staticShadowOpacity}} />
        <div className={styles.content}>
          {props.children}
        </div>
      </div>
    </div>
  );
}
