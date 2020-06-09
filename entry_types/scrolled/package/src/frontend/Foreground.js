import React from 'react';
import classNames from 'classnames';

import styles from './Foreground.module.css';

export default function Foreground(props) {
  return (
    <div className={className(props)}>
      {props.children}
    </div>
  );
}

function className(props) {
  return classNames(
    styles.Foreground,
    props.transitionStyles.foreground,
    props.transitionStyles[`foreground-${props.state}`],
    styles[`${props.heightMode}Height`]
  )
}
