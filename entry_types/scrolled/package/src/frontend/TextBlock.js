import React from 'react';
import classNames from 'classnames'

import {Text} from './Text';

import styles from './TextBlock.module.css';

export default function TextBlock(props) {
  return (
    <Text scaleCategory="body">
      <div className={classNames(styles.text, {[styles.dummy]: props.dummy})}
           dangerouslySetInnerHTML={{__html: props.children}} />
    </Text>
  );
}
