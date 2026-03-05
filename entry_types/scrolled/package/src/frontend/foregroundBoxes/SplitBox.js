import React from 'react';
import classNames from 'classnames';

import styles from './SplitBox.module.css';

export default function SplitBox(props) {
  return (
    <div className={styles.wrapper} style={{paddingTop: props.motifAreaState.paddingTop}}>
      {props.motifAreaState.isContentPadded &&
        <div className={classNames(props.inverted ? styles.overlayLight : styles.overlayDark,
                                   {[styles.long]: props.coverInvisibleNextSection})}
             style={{
               top: props.motifAreaState.paddingTop,
               ...(props.splitSurfaceColor
                   ? {backgroundColor: props.splitSurfaceColor}
                   : undefined)
             }} />}
      <div className={styles.content}>
        {props.children}
      </div>
    </div>
  );
}
