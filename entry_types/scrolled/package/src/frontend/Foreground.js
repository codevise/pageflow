import React, {createContext, useContext} from 'react';
import classNames from 'classnames';

import styles from './Foreground.module.css';

export const ForcePaddingContext = createContext(false);

export default function Foreground(props) {
  const forcePadding = useContext(ForcePaddingContext);

  return (
    <div className={className(props, forcePadding)}>
      {props.children}
    </div>
  );
}

function className(props, forcePadding) {
  return classNames(
    styles.Foreground,
    props.transitionStyles.foreground,
    props.transitionStyles[`foreground-${props.state}`],
    {[styles.paddingBottom]: props.paddingBottom || forcePadding},
    styles[`${props.heightMode}Height`]
  )
}
