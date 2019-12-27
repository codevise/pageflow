import React from 'react';
import classNames from 'classnames'

import styles from './TextBlock.module.css';

export default function TextBlock(props) {
  return (
    <div className={classNames(styles.TextBlock, {[styles.dummy]: props.dummy})}
         style={props.style}
         dangerouslySetInnerHTML={{__html: props.children}} />
  );
}
