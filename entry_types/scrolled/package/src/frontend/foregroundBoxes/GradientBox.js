import React from 'react';
import classNames from 'classnames';

import styles from './GradientBox.module.css';

export default function GradientBox(props) {
  const padding = props.active ? props.padding : 0;

  return (
    <div className={classNames(styles.root,
                               {
                                 [styles.gradient]: padding > 0,
                                 [styles.long]: props.coverInvisibleNextSection
                               })}
         style={{paddingTop: padding}}>
      <div className={styles.wrapper}>
        <div className={classNames(styles.shadow,
                                   props.inverted ? styles.shadowLight : styles.shadowDark,
                                   props.transitionStyles.boxShadow,
                                   props.transitionStyles[`boxShadow-${props.state}`])}
             style={{top: padding, opacity: props.opacity}} />
        <div className={styles.content}>
          {props.children}
        </div>
      </div>
    </div>
  );
}

GradientBox.defaultProps = {
  opacity: 1
}
