import React from 'react';

import styles from './InlineCaption.module.css';

export default function InlineCaption(props) {
  if (props.text) {
    return (
      <div className={styles.root}>
        {props.text}
      </div>
    );
  }
  else {
    return null;
  }
}
