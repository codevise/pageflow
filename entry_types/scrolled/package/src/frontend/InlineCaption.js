import React from 'react';

import {Text} from './Text';

import styles from './InlineCaption.module.css';

export default function InlineCaption(props) {
  if (props.text) {
    return (
      <div className={styles.root}>
        <Text scaleCategory="caption">
          {props.text}
        </Text>
      </div>
    );
  }
  else {
    return null;
  }
}
