import React from 'react';
import classNames from 'classnames';

import {withInlineEditingDecorator} from './inlineEditing';

import styles from './Foreground.module.css';

export default withInlineEditingDecorator('ForegroundDecorator', function Foreground(props) {
  return (
    <div className={className(props)}>
      {props.children}
    </div>
  );
})

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
