import React from 'react';
import classNames from 'classnames';

import {useEditorSelection} from './EditorState';

import styles from './Foreground.module.css';

export default function Foreground(props) {
  const {resetSelection} = useEditorSelection();

  return (
    <div className={className(props)} onClick={resetSelection}>
      {props.children}
    </div>
  );
}

function className(props) {
  return classNames(
    styles.Foreground,
    props.transitionStyles.foreground,
    props.transitionStyles[`foreground-${props.state}`],
    styles[`${props.heightMode}Height`],
    {
      [styles.hidden]: props.hidden,
      [styles.enlarge]: props.hidden && !props.disableEnlarge
    }
  )
}
