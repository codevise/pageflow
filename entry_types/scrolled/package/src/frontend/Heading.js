import React from 'react';
import classNames from 'classnames';

import {Text} from './Text';

import styles from './Heading.module.css';

export default function Heading({first, children}) {
  return (
    <h1 className={classNames(styles.root, {[styles.first]: first})}>
      <Text scaleCategory={first ? 'h1' : 'h2'} inline={true}>
        {children}
      </Text>
    </h1>
  );
}
