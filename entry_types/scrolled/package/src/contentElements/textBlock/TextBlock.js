import React from 'react';
import classNames from 'classnames'

import {Text} from 'pageflow-scrolled/frontend';

import styles from './TextBlock.module.css';

export function TextBlock({configuration}) {
  return (
    <Text scaleCategory="body">
      <div className={classNames(styles.text, {[styles.dummy]: configuration.dummy})}
           dangerouslySetInnerHTML={{__html: configuration.children}} />
    </Text>
  );
}
